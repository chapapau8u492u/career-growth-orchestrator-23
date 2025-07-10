
import { Template } from '../../utils/templateEngine';

export const professionalTemplate: Template = {
  id: 'professional-sidebar',
  name: 'Professional Sidebar',
  description: 'Classic business resume with sidebar layout',
  preview: '/lovable-uploads/professional.png',
  hasPhoto: true,
  isHandlebars: true,
  html: `
    <div class="professional-resume">
      <div class="sidebar">
        <div class="profile-section">
          {{#if_has_photo hasPhoto}}
            <div class="profile-photo">
              {{#if profileImage}}
                <img src="{{profileImage}}" alt="Profile Photo" />
              {{else}}
                <div class="photo-placeholder">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              {{/if}}
            </div>
          {{/if_has_photo}}
          <h1 class="name">{{fullName}}</h1>
          {{#if experiences.[0].jobTitle}}
            <p class="title">{{experiences.[0].jobTitle}}</p>
          {{/if}}
        </div>

        <div class="contact-section">
          <h3 class="sidebar-title">Contact</h3>
          {{#if location}}
            <div class="contact-item">
              <span class="label">📍 Address</span>
              <p>{{location}}</p>
            </div>
          {{/if}}
          {{#if phone}}
            <div class="contact-item">
              <span class="label">📞 Phone</span>
              <p>{{phone}}</p>
            </div>
          {{/if}}
          {{#if email}}
            <div class="contact-item">
              <span class="label">✉️ Email</span>
              <p>{{email}}</p>
            </div>
          {{/if}}
        </div>

        {{#if skills}}
          <div class="skills-section">
            <h3 class="sidebar-title">Skills</h3>
            <ul class="skills-list">
              {{#each skills}}
                <li>{{name}}</li>
              {{/each}}
            </ul>
          </div>
        {{/if}}
      </div>

      <div class="main-content">
        {{#if summary}}
          <section class="section">
            <h2 class="section-title">Professional Profile</h2>
            <p class="summary">{{summary}}</p>
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
                    <p class="company">{{company}} • {{location}}</p>
                  </div>
                  <span class="date-range">
                    {{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}
                  </span>
                </div>
                {{#if description}}
                  <p class="job-description">{{description}}</p>
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
                    <p class="school">{{school}} • {{location}}</p>
                  </div>
                  <span class="graduation-date">{{formatDate graduationDate}}</span>
                </div>
                {{#if gpa}}
                  <p class="gpa">GPA: {{gpa}}</p>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}
      </div>
    </div>
  `,
  css: `
    .professional-resume {
      display: flex;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
      margin: 0;
    }
    
    .sidebar {
      width: 280px;
      background: #2c3e50;
      color: white;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .profile-section {
      text-align: center;
    }
    
    .profile-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      overflow: hidden;
      background: #34495e;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #3498db;
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      color: #7f8c8d;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }
    
    .title {
      color: #bdc3c7;
      margin: 0;
      font-size: 1rem;
      font-weight: 400;
    }
    
    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .contact-item {
      margin-bottom: 1.25rem;
    }
    
    .label {
      color: #bdc3c7;
      font-size: 0.85rem;
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    
    .contact-item p {
      margin: 0;
      font-size: 0.9rem;
      word-break: break-word;
      line-height: 1.4;
    }
    
    .skills-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .skills-list li {
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
      color: #ecf0f1;
      padding-left: 1rem;
      position: relative;
    }
    
    .skills-list li:before {
      content: "▶";
      color: #3498db;
      position: absolute;
      left: 0;
    }
    
    .main-content {
      flex: 1;
      padding: 2.5rem;
      background: white;
      overflow-x: auto;
    }
    
    .section {
      margin-bottom: 2.5rem;
    }
    
    .section-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #3498db;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary {
      color: #555;
      line-height: 1.7;
      margin: 0;
      font-size: 1.05rem;
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
      color: #2c3e50;
    }
    
    .company, .school {
      color: #7f8c8d;
      margin: 0.25rem 0 0 0;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .date-range, .graduation-date {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-weight: 500;
      background: #f8f9fa;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      border: 1px solid #e9ecef;
    }
    
    .job-description {
      color: #555;
      line-height: 1.6;
      margin: 0.75rem 0 0 0;
      font-size: 0.95rem;
    }
    
    .gpa {
      font-size: 0.85rem;
      color: #7f8c8d;
      margin: 0.5rem 0 0 0;
      font-style: italic;
    }
    
    @media (max-width: 900px) {
      .professional-resume {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        padding: 1.5rem;
      }
      
      .profile-section {
        text-align: left;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .profile-photo {
        margin: 0;
        width: 100px;
        height: 100px;
      }
      
      .main-content {
        padding: 2rem 1.5rem;
      }
      
      .experience-header, .education-header {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .date-range, .graduation-date {
        align-self: flex-start;
      }
    }
  `,
  isCustom: false
};
