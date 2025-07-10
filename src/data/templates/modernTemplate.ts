
import { Template } from '../../utils/templateEngine';

export const modernTemplate: Template = {
  id: 'modern-gradient',
  name: 'Modern Gradient', 
  description: 'Clean gradient design with dynamic data rendering',
  preview: '/lovable-uploads/modern.png',
  hasPhoto: true,
  isHandlebars: true,
  html: `
    <div class="modern-resume">
      <div class="header">
        <div class="header-content">
          <div class="personal-info">
            <h1 class="name">{{fullName}}</h1>
            {{#if experiences.[0].jobTitle}}
              <p class="title">{{experiences.[0].jobTitle}}</p>
            {{/if}}
            <div class="contact-info">
              {{#if phone}}
                <span class="contact-item">📞 {{phone}}</span>
              {{/if}}
              {{#if email}}
                <span class="contact-item">✉️ {{email}}</span>
              {{/if}}
              {{#if location}}
                <span class="contact-item">📍 {{location}}</span>
              {{/if}}
            </div>
          </div>
          {{#if_has_photo hasPhoto}}
            {{#if profileImage}}
              <div class="profile-photo">
                <img src="{{profileImage}}" alt="Profile Photo" />
              </div>
            {{/if}}
          {{/if_has_photo}}
        </div>
      </div>

      <div class="content">
        {{#if summary}}
          <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary-text">{{summary}}</p>
          </section>
        {{/if}}

        {{#if experiences}}
          <section class="section">
            <h2 class="section-title">Work Experience</h2>
            {{#each experiences}}
              <div class="experience-item">
                <div class="experience-header">
                  <div class="job-info">
                    <h3 class="job-title">{{jobTitle}}</h3>
                    <p class="company">{{company}}</p>
                  </div>
                  <div class="job-details">
                    <p class="location">{{location}}</p>
                    <p class="dates">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</p>
                  </div>
                </div>
                {{#if description}}
                  <div class="job-description">
                    <p>{{description}}</p>
                  </div>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if education}}
          <section class="section">
            <h2 class="section-title">Education</h2>
            {{#each education}}
              <div class="education-item">
                <div class="education-header">
                  <div class="degree-info">
                    <h3 class="degree">{{degree}}</h3>
                    <p class="school">{{school}}</p>
                  </div>
                  <div class="education-details">
                    <p class="location">{{location}}</p>
                    <p class="graduation">{{formatDate graduationDate}}</p>
                  </div>
                </div>
                {{#if gpa}}
                  <p class="gpa">GPA: {{gpa}}</p>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if skills}}
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-container">
              {{#each skills}}
                <span class="skill-tag">{{name}}</span>
              {{/each}}
            </div>
          </section>
        {{/if}}
      </div>
    </div>
  `,
  css: `
    .modern-resume {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2.5rem 2rem;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .personal-info {
      flex: 1;
    }
    
    .name {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.5px;
    }
    
    .title {
      font-size: 1.3rem;
      margin: 0 0 1rem 0;
      opacity: 0.9;
      font-weight: 400;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
    }
    
    .contact-item {
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .profile-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .content {
      padding: 2.5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section {
      margin-bottom: 2.5rem;
    }
    
    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-text {
      color: #555;
      font-size: 1.05rem;
      line-height: 1.7;
      margin: 0;
    }
    
    .experience-item, .education-item {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .experience-item:last-child, .education-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    .job-title, .degree {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
    
    .company, .school {
      color: #667eea;
      font-weight: 500;
      margin: 0.25rem 0 0 0;
      font-size: 1rem;
    }
    
    .job-details, .education-details {
      text-align: right;
      font-size: 0.9rem;
      color: #666;
    }
    
    .job-details p, .education-details p {
      margin: 0.25rem 0;
    }
    
    .job-description {
      color: #555;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-top: 0.5rem;
    }
    
    .job-description p {
      margin: 0;
    }
    
    .gpa {
      font-size: 0.9rem;
      color: #666;
      margin: 0.5rem 0 0 0;
      font-style: italic;
    }
    
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .skill-tag {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      color: #667eea;
      padding: 0.6rem 1.2rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 500;
      border: 1px solid rgba(102, 126, 234, 0.2);
      transition: all 0.3s ease;
    }
    
    .skill-tag:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }
      
      .experience-header, .education-header {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .job-details, .education-details {
        text-align: left;
      }
      
      .name {
        font-size: 2rem;
      }
      
      .header, .content {
        padding: 2rem 1rem;
      }
      
      .skills-container {
        justify-content: center;
      }
    }
  `,
  isCustom: false
};
