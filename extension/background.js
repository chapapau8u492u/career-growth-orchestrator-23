
// Background script for the Chrome extension
console.log('JobTracker background script loaded');

// Handle installation
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('JobTracker extension installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Background received message:', request);
  
  if (request.action === 'saveJobData') {
    handleSaveJobData(request.jobData, sendResponse);
    return true;
  }
  
  if (request.action === 'getResumes') {
    handleGetResumes(sendResponse);
    return true;
  }
  
  if (request.action === 'generateCoverLetter') {
    handleGenerateCoverLetter(request.data, sendResponse);
    return true;
  }
});

async function handleGetResumes(sendResponse) {
  try {
    // Try to get resumes from backend
    const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/resumes', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Resumes fetched from backend:', data);
      const resumes = (data.resumes || []).map(resume => ({
        id: resume.id,
        title: resume.title || `${resume.personalInfo?.fullName || resume.personalInfo?.firstName || 'Untitled'} Resume`
      }));
      sendResponse({success: true, resumes});
      return;
    }
    
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
  } catch (error) {
    console.error('Error fetching resumes from backend:', error);
    
    // Try to get resumes from JobTracker tabs directly
    try {
      const tabs = await chrome.tabs.query({});
      let resumesFound = false;
      
      for (const tab of tabs) {
        if (tab.url && (
          tab.url.includes('e696d393-e4c6-4336-8245-a06a9e89584f.lovableproject.com') ||
          tab.url.includes('localhost:5173') ||
          tab.url.includes('127.0.0.1:5173')
        )) {
          try {
            const result = await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                try {
                  const savedResumes = localStorage.getItem('resumes');
                  if (savedResumes) {
                    const resumes = JSON.parse(savedResumes);
                    console.log('Found resumes in localStorage:', resumes);
                    return resumes.map(resume => ({
                      id: resume.id,
                      title: resume.title || `${resume.personalInfo?.fullName || 'Untitled'} Resume`
                    }));
                  }
                  return [];
                } catch (error) {
                  console.error('Error getting resumes from localStorage:', error);
                  return [];
                }
              }
            });
            
            if (result && result[0] && result[0].result && result[0].result.length > 0) {
              console.log('Resumes found from tab localStorage:', result[0].result);
              sendResponse({success: true, resumes: result[0].result});
              resumesFound = true;
              break;
            }
          } catch (scriptError) {
            console.log('Could not execute script in tab:', scriptError);
          }
        }
      }
      
      if (!resumesFound) {
        sendResponse({success: false, error: 'No resumes found. Please create a resume first.', resumes: []});
      }
    } catch (tabError) {
      console.error('Error accessing tabs:', tabError);
      sendResponse({success: false, error: tabError.message, resumes: []});
    }
  }
}

async function handleGenerateCoverLetter(data, sendResponse) {
  try {
    console.log('Generating cover letter with data:', data);
    
    const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/generate-cover-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        company: data.company,
        position: data.position,
        description: data.description,
        location: data.location,
        salary: data.salary,
        resumeId: data.resumeId
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Cover letter generated successfully');
      sendResponse({success: true, coverLetter: result.coverLetter});
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error generating cover letter:', error);
    
    // Enhanced fallback cover letter generation
    const fallbackCoverLetter = generateEnhancedFallbackCoverLetter(data);
    sendResponse({success: true, coverLetter: fallbackCoverLetter});
  }
}

function generateEnhancedFallbackCoverLetter(data) {
  const { company, position, description, location, salary } = data;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let locationText = location ? `I am excited about the opportunity to work in ${location}.` : '';
  let salaryText = salary ? `I note that the position offers ${salary}, which aligns with my expectations.` : '';
  
  let descriptionBasedText = '';
  if (description) {
    const descLower = description.toLowerCase();
    if (descLower.includes('react') || descLower.includes('javascript')) {
      descriptionBasedText = 'My extensive experience with React and JavaScript makes me well-suited for this role.';
    } else if (descLower.includes('python') || descLower.includes('data')) {
      descriptionBasedText = 'My background in Python and data analysis aligns perfectly with your requirements.';
    } else if (descLower.includes('team') || descLower.includes('collaboration')) {
      descriptionBasedText = 'I thrive in collaborative environments and enjoy working with cross-functional teams.';
    } else {
      descriptionBasedText = 'The role requirements align well with my professional background and technical expertise.';
    }
  }
  
  return `${currentDate}

Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${company}. After reviewing the job description, I am confident that my skills and experience make me an excellent candidate for this role.

${descriptionBasedText} ${locationText} ${salaryText}

I am particularly drawn to ${company}'s reputation and would be thrilled to contribute to your team's continued success. My technical skills, combined with my passion for innovation and problem-solving, would allow me to make meaningful contributions from day one.

I would welcome the opportunity to discuss how my background and enthusiasm can benefit ${company}. Thank you for considering my application.

Best regards,
[Your Name]`;
}

async function handleSaveJobData(jobData, sendResponse) {
  console.log('Handling save job data:', jobData);
  
  try {
    // Try production URL first
    const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...jobData,
        // Include selected resume info
        resumeUsed: jobData.resumeUsed || null,
        appliedAt: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Successfully saved to backend:', data);
      sendResponse({success: true, data: data});
      
      // Also try to communicate directly with any open JobTracker tabs
      notifyJobTrackerTabs(jobData);
      return;
    }
    
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
  } catch (error) {
    console.error('Backend save failed:', error);
    
    // Try direct communication with JobTracker tabs
    const tabsNotified = await notifyJobTrackerTabs(jobData);
    if (tabsNotified) {
      sendResponse({success: true, message: 'Data sent directly to JobTracker app'});
    } else {
      sendResponse({success: false, error: error.message});
    }
  }
}

async function notifyJobTrackerTabs(jobData) {
  try {
    // Find all tabs that might be the JobTracker app
    const tabs = await chrome.tabs.query({});
    let notified = false;
    
    for (const tab of tabs) {
      if (tab.url && (
        tab.url.includes('e696d393-e4c6-4336-8245-a06a9e89584f.lovableproject.com') ||
        tab.url.includes('localhost:5173') ||
        tab.url.includes('127.0.0.1:5173')
      )) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: 'JOB_APPLICATION_DATA',
            jobData: jobData
          });
          console.log('Sent job data to JobTracker tab:', tab.url);
          notified = true;
        } catch (error) {
          console.log('Could not send message to tab:', error);
          
          // Try using executeScript to inject the data
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (data) => {
                // Store in localStorage for the app to pick up
                localStorage.setItem('extensionJobData', JSON.stringify(data));
                
                // Trigger a storage event
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'extensionJobData',
                  newValue: JSON.stringify(data)
                }));
                
                console.log('JobTracker extension: Data injected into app');
              },
              args: [jobData]
            });
            notified = true;
          } catch (scriptError) {
            console.log('Could not inject script:', scriptError);
          }
        }
      }
    }
    
    return notified;
  } catch (error) {
    console.error('Error notifying JobTracker tabs:', error);
    return false;
  }
}
