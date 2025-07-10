
export const generatePDF = (resumeData: any, template: string) => {
  // Create HTML content for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${resumeData.personalInfo.fullName} - Resume</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.4; 
          margin: 0; 
          padding: 20px; 
          color: #333;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .header-content { flex: 1; }
        .profile-image { 
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.3);
        }
        h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
        h2 { 
          color: #667eea; 
          font-size: 18px; 
          margin: 20px 0 10px 0; 
          border-bottom: 2px solid #667eea; 
          padding-bottom: 5px;
        }
        h3 { margin: 15px 0 5px 0; font-size: 16px; }
        .contact-info { display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; }
        .contact-item { display: flex; align-items: center; gap: 5px; }
        .section { margin-bottom: 25px; }
        .job-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 10px; 
        }
        .job-title { font-weight: bold; margin: 0; }
        .company { color: #667eea; font-weight: 500; }
        .date-location { font-size: 12px; color: #666; text-align: right; }
        ul { margin: 8px 0; padding-left: 20px; }
        li { margin-bottom: 5px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { 
          background: #f0f0f0; 
          padding: 4px 8px; 
          border-radius: 15px; 
          font-size: 12px; 
        }
        a { color: inherit; text-decoration: none; }
        a:hover { text-decoration: underline; }
        @media print {
          body { margin: 0; padding: 15px; }
          .header { margin-bottom: 15px; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <h1>${resumeData.personalInfo.fullName || 'Your Name'}</h1>
          ${resumeData.experiences[0]?.jobTitle ? `<p style="margin: 0; font-size: 16px; opacity: 0.9;">${resumeData.experiences[0].jobTitle}</p>` : ''}
          <div class="contact-info">
            ${resumeData.personalInfo.phone ? `<span class="contact-item">📞 ${resumeData.personalInfo.phone}</span>` : ''}
            ${resumeData.personalInfo.email ? `<span class="contact-item">✉️ <a href="mailto:${resumeData.personalInfo.email}">${resumeData.personalInfo.email}</a></span>` : ''}
            ${resumeData.personalInfo.location ? `<span class="contact-item">📍 ${resumeData.personalInfo.location}</span>` : ''}
            ${resumeData.personalInfo.linkedIn ? `<span class="contact-item">💼 <a href="${resumeData.personalInfo.linkedIn}" target="_blank">LinkedIn Profile</a></span>` : ''}
            ${resumeData.personalInfo.website ? `<span class="contact-item">🌐 <a href="${resumeData.personalInfo.website}" target="_blank">Website</a></span>` : ''}
          </div>
        </div>
        ${resumeData.personalInfo.profileImage ? `<img src="${resumeData.personalInfo.profileImage}" alt="Profile" class="profile-image">` : ''}
      </div>

      ${resumeData.personalInfo.summary ? `
        <div class="section">
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>${resumeData.personalInfo.summary}</p>
        </div>
      ` : ''}

      ${resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences[0].jobTitle ? `
        <div class="section">
          <h2>PROFESSIONAL EXPERIENCE</h2>
          ${resumeData.experiences.map((exp: any) => `
            <div style="margin-bottom: 20px;">
              <div class="job-header">
                <div>
                  <h3 class="job-title">${exp.jobTitle}</h3>
                  <p class="company">${exp.company}</p>
                </div>
                <div class="date-location">
                  <div>${exp.location}</div>
                  <div>${exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''} - ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '')}</div>
                </div>
              </div>
              ${exp.description ? `
                <ul>
                  ${exp.description.split('\n').map((line: string) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                      return `<li>${trimmed.substring(1).trim()}</li>`;
                    }
                    return trimmed ? `<li>${trimmed}</li>` : '';
                  }).filter(Boolean).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education && resumeData.education.length > 0 && resumeData.education[0].degree ? `
        <div class="section">
          <h2>EDUCATION</h2>
          ${resumeData.education.map((edu: any) => `
            <div style="margin-bottom: 15px;">
              <div class="job-header">
                <div>
                  <h3>${edu.degree}</h3>
                  <p class="company">${edu.school}</p>
                  ${edu.gpa ? `<p style="font-size: 12px; color: #666; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                </div>
                <div class="date-location">
                  <div>${edu.location}</div>
                  <div>${edu.graduationDate ? new Date(edu.graduationDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2>SKILLS</h2>
          <div class="skills">
            ${resumeData.skills.map((skill: any) => `<span class="skill-tag">${skill.name}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }
};

export const downloadResumeHTML = (resumeData: any, template: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${resumeData.personalInfo.fullName} - Resume</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.4; 
          margin: 0; 
          padding: 20px; 
          color: #333;
          max-width: 800px;
          margin: 0 auto;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-radius: 8px;
        }
        .header-content { flex: 1; }
        .profile-image { 
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.3);
        }
        h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: bold; }
        h2 { 
          color: #667eea; 
          font-size: 18px; 
          margin: 20px 0 10px 0; 
          border-bottom: 2px solid #667eea; 
          padding-bottom: 5px;
        }
        h3 { margin: 15px 0 5px 0; font-size: 16px; }
        .contact-info { display: flex; flex-wrap: wrap; gap: 15px; font-size: 14px; }
        .contact-item { display: flex; align-items: center; gap: 5px; }
        .section { margin-bottom: 25px; }
        .job-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 10px; 
        }
        .job-title { font-weight: bold; margin: 0; }
        .company { color: #667eea; font-weight: 500; }
        .date-location { font-size: 12px; color: #666; text-align: right; }
        ul { margin: 8px 0; padding-left: 20px; }
        li { margin-bottom: 5px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { 
          background: #f0f0f0; 
          padding: 4px 8px; 
          border-radius: 15px; 
          font-size: 12px; 
        }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <h1>${resumeData.personalInfo.fullName || 'Your Name'}</h1>
          ${resumeData.experiences[0]?.jobTitle ? `<p style="margin: 0; font-size: 16px; opacity: 0.9;">${resumeData.experiences[0].jobTitle}</p>` : ''}
          <div class="contact-info">
            ${resumeData.personalInfo.phone ? `<span class="contact-item">📞 ${resumeData.personalInfo.phone}</span>` : ''}
            ${resumeData.personalInfo.email ? `<span class="contact-item">✉️ <a href="mailto:${resumeData.personalInfo.email}">${resumeData.personalInfo.email}</a></span>` : ''}
            ${resumeData.personalInfo.location ? `<span class="contact-item">📍 ${resumeData.personalInfo.location}</span>` : ''}
            ${resumeData.personalInfo.linkedIn ? `<span class="contact-item">💼 <a href="${resumeData.personalInfo.linkedIn}" target="_blank">LinkedIn Profile</a></span>` : ''}
            ${resumeData.personalInfo.website ? `<span class="contact-item">🌐 <a href="${resumeData.personalInfo.website}" target="_blank">Website</a></span>` : ''}
          </div>
        </div>
        ${resumeData.personalInfo.profileImage ? `<img src="${resumeData.personalInfo.profileImage}" alt="Profile" class="profile-image">` : ''}
      </div>

      ${resumeData.personalInfo.summary ? `
        <div class="section">
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>${resumeData.personalInfo.summary}</p>
        </div>
      ` : ''}

      ${resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences[0].jobTitle ? `
        <div class="section">
          <h2>PROFESSIONAL EXPERIENCE</h2>
          ${resumeData.experiences.map((exp: any) => `
            <div style="margin-bottom: 20px;">
              <div class="job-header">
                <div>
                  <h3 class="job-title">${exp.jobTitle}</h3>
                  <p class="company">${exp.company}</p>
                </div>
                <div class="date-location">
                  <div>${exp.location}</div>
                  <div>${exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''} - ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '')}</div>
                </div>
              </div>
              ${exp.description ? `
                <ul>
                  ${exp.description.split('\n').map((line: string) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                      return `<li>${trimmed.substring(1).trim()}</li>`;
                    }
                    return trimmed ? `<li>${trimmed}</li>` : '';
                  }).filter(Boolean).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education && resumeData.education.length > 0 && resumeData.education[0].degree ? `
        <div class="section">
          <h2>EDUCATION</h2>
          ${resumeData.education.map((edu: any) => `
            <div style="margin-bottom: 15px;">
              <div class="job-header">
                <div>
                  <h3>${edu.degree}</h3>
                  <p class="company">${edu.school}</p>
                  ${edu.gpa ? `<p style="font-size: 12px; color: #666; margin: 0;">GPA: ${edu.gpa}</p>` : ''}
                </div>
                <div class="date-location">
                  <div>${edu.location}</div>
                  <div>${edu.graduationDate ? new Date(edu.graduationDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.skills && resumeData.skills.length > 0 ? `
        <div class="section">
          <h2>SKILLS</h2>
          <div class="skills">
            ${resumeData.skills.map((skill: any) => `<span class="skill-tag">${skill.name}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resumeData.personalInfo.fullName || 'Resume'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
