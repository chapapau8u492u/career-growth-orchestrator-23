
let availableResumes = [];

document.addEventListener('DOMContentLoaded', function() {
  loadResumes();
  
  // Auto-fill form from current page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractJobDetails
      }, function(results) {
        if (results && results[0] && results[0].result) {
          populateForm(results[0].result);
        }
      });
    }
  });

  document.getElementById('jobForm').addEventListener('submit', handleSubmit);
});

function extractJobDetails() {
  // Extract job details from the current page
  const jobDetails = {
    company: '',
    position: '',
    location: '',
    salary: '',
    description: '',
    jobUrl: window.location.href
  };

  // Try to extract company name
  const companySelectors = [
    '[data-testid="inlineHeader-companyName"]',
    '.jobs-unified-top-card__company-name',
    '[data-company-name]',
    '.company-name',
    'h1 + div a',
    '.job-company'
  ];
  
  for (const selector of companySelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobDetails.company = element.textContent.trim();
      break;
    }
  }

  // Try to extract position title
  const positionSelectors = [
    '[data-testid="inlineHeader-title"]',
    '.jobs-unified-top-card__job-title',
    'h1',
    '.job-title',
    '[data-job-title]'
  ];
  
  for (const selector of positionSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobDetails.position = element.textContent.trim();
      break;
    }
  }

  // Try to extract location
  const locationSelectors = [
    '[data-testid="inlineHeader-primaryLocation"]',
    '.jobs-unified-top-card__bullet',
    '.job-location',
    '[data-job-location]'
  ];
  
  for (const selector of locationSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim() && !element.textContent.includes('$')) {
      jobDetails.location = element.textContent.trim();
      break;
    }
  }

  // Try to extract description
  const descriptionSelectors = [
    '[data-testid="jobsearch-JobComponent-description"]',
    '.jobs-description-content__text',
    '.job-description',
    '[data-job-description]'
  ];
  
  for (const selector of descriptionSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobDetails.description = element.textContent.trim().substring(0, 1000); // Limit length
      break;
    }
  }

  return jobDetails;
}

function populateForm(jobDetails) {
  document.getElementById('company').value = jobDetails.company || '';
  document.getElementById('position').value = jobDetails.position || '';
  document.getElementById('location').value = jobDetails.location || '';
  document.getElementById('salary').value = jobDetails.salary || '';
  document.getElementById('jobUrl').value = jobDetails.jobUrl || '';
  document.getElementById('description').value = jobDetails.description || '';
}

function loadResumes() {
  chrome.runtime.sendMessage({action: 'getResumes'}, function(response) {
    const loadingDiv = document.getElementById('loading');
    const formDiv = document.getElementById('jobForm');
    const errorDiv = document.getElementById('error');
    
    if (response && response.success && response.resumes) {
      availableResumes = response.resumes;
      populateResumeSelector(response.resumes);
      
      loadingDiv.style.display = 'none';
      formDiv.style.display = 'block';
    } else {
      loadingDiv.style.display = 'none';
      errorDiv.style.display = 'block';
      errorDiv.textContent = response?.error || 'Failed to load resumes. Please create a resume first.';
    }
  });
}

function populateResumeSelector(resumes) {
  const select = document.getElementById('resumeSelect');
  select.innerHTML = '<option value="">Choose resume...</option>';
  
  resumes.forEach(resume => {
    const option = document.createElement('option');
    option.value = resume.id;
    option.textContent = resume.title;
    select.appendChild(option);
  });
}

function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const selectedResumeId = document.getElementById('resumeSelect').value;
  const selectedResume = availableResumes.find(r => r.id === selectedResumeId);
  
  if (!selectedResumeId) {
    showError('Please select a resume');
    return;
  }
  
  const jobData = {
    company: formData.get('company') || document.getElementById('company').value,
    position: formData.get('position') || document.getElementById('position').value,
    location: formData.get('location') || document.getElementById('location').value,
    salary: formData.get('salary') || document.getElementById('salary').value,
    jobUrl: formData.get('jobUrl') || document.getElementById('jobUrl').value,
    description: formData.get('description') || document.getElementById('description').value,
    notes: formData.get('notes') || document.getElementById('notes').value,
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    resumeUsed: {
      id: selectedResumeId,
      title: selectedResume.title
    }
  };

  // Disable submit button
  const submitBtn = document.getElementById('saveBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  chrome.runtime.sendMessage({
    action: 'saveJobData',
    jobData: jobData
  }, function(response) {
    if (response && response.success) {
      showSuccess('Job application saved successfully!');
      setTimeout(() => {
        window.close();
      }, 2000);
    } else {
      showError(response?.error || 'Failed to save job application');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Application';
    }
  });
}

function showSuccess(message) {
  const successDiv = document.getElementById('success');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  document.getElementById('error').style.display = 'none';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('success').style.display = 'none';
}
