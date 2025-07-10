
import { Template } from '../utils/templateEngine';
import { creativeTemplate } from './templates/creativeTemplate';
import { modernTemplate } from './templates/modernTemplate';
import { professionalTemplate } from './templates/professionalTemplate';
import { minimalTemplate } from './templates/minimalTemplate';

// Additional templates to match the 7 shown in the image
const elegantTemplate: Template = {
  id: 'elegant-serif',
  name: 'Elegant',
  description: 'Sophisticated serif design with classic styling',
  preview: '/lovable-uploads/elegant.png',
  hasPhoto: true,
  isHandlebars: true,
  html: `
    <div class="elegant-resume">
      <div class="header">
        <div class="header-content">
          {{#if_has_photo hasPhoto}}
            {{#if profileImage}}
              <div class="profile-photo">
                <img src="{{profileImage}}" alt="Profile Photo" />
              </div>
            {{/if}}
          {{/if_has_photo}}
          <div class="name-section">
            <h1 class="name">{{fullName}}</h1>
            {{#if experiences.[0].jobTitle}}
              <p class="title">{{experiences.[0].jobTitle}}</p>
            {{/if}}
          </div>
        </div>
        <div class="contact-line">
          {{#if email}}{{email}}{{/if}}
          {{#if phone}} • {{phone}}{{/if}}
          {{#if location}} • {{location}}{{/if}}
        </div>
      </div>

      <div class="content">
        {{#if summary}}
          <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary">{{summary}}</p>
          </section>
        {{/if}}

        {{#if experiences}}
          <section class="section">
            <h2 class="section-title">Experience</h2>
            {{#each experiences}}
              <div class="experience-item">
                <div class="experience-header">
                  <h3 class="job-title">{{jobTitle}}</h3>
                  <span class="date">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
                </div>
                <p class="company">{{company}}, {{location}}</p>
                {{#if description}}
                  <p class="description">{{description}}</p>
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
                  <h3 class="degree">{{degree}}</h3>
                  <span class="date">{{formatDate graduationDate}}</span>
                </div>
                <p class="school">{{school}}, {{location}}</p>
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if skills}}
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              {{#each skills}}
                <span class="skill">{{name}}</span>
              {{/each}}
            </div>
          </section>
        {{/if}}
      </div>
    </div>
  `,
  css: `
    .elegant-resume {
      font-family: 'Times New Roman', serif;
      color: #2c3e50;
      line-height: 1.7;
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
      background: #fff;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      border-bottom: 2px solid #34495e;
      padding-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .profile-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #34495e;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-size: 2.5rem;
      font-weight: 400;
      margin: 0;
      color: #2c3e50;
      letter-spacing: 1px;
    }

    .title {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin: 0.5rem 0 0 0;
      font-style: italic;
    }

    .contact-line {
      color: #7f8c8d;
      font-size: 0.95rem;
    }

    .section {
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid #bdc3c7;
      padding-bottom: 0.5rem;
    }

    .summary {
      font-size: 1.1rem;
      color: #34495e;
      text-align: justify;
      margin: 0;
    }

    .experience-item, .education-item {
      margin-bottom: 2rem;
    }

    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }

    .job-title, .degree {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .date {
      font-size: 0.9rem;
      color: #7f8c8d;
      font-style: italic;
    }

    .company, .school {
      color: #7f8c8d;
      margin: 0.25rem 0 0.75rem 0;
      font-weight: 500;
    }

    .description {
      color: #34495e;
      margin: 0;
      text-align: justify;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .skill {
      background: #ecf0f1;
      color: #2c3e50;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .elegant-resume {
        padding: 2rem 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .name {
        font-size: 2rem;
      }

      .experience-header, .education-header {
        flex-direction: column;
        gap: 0.25rem;
      }
    }
  `,
  isCustom: false
};

const studentTemplate: Template = {
  id: 'student-focused',
  name: 'Student',
  description: 'Perfect for students and recent graduates',
  preview: '/lovable-uploads/student.png',
  hasPhoto: false,
  isHandlebars: true,
  html: `
    <div class="student-resume">
      <div class="header">
        <h1 class="name">{{fullName}}</h1>
        <div class="contact-info">
          {{#if email}}<span>{{email}}</span>{{/if}}
          {{#if phone}} | <span>{{phone}}</span>{{/if}}
          {{#if location}} | <span>{{location}}</span>{{/if}}
        </div>
      </div>

      <div class="content">
        {{#if summary}}
          <section class="section">
            <h2 class="section-title">Objective</h2>
            <p class="objective">{{summary}}</p>
          </section>
        {{/if}}

        {{#if education}}
          <section class="section">
            <h2 class="section-title">Education</h2>
            {{#each education}}
              <div class="education-item">
                <div class="item-header">
                  <h3 class="degree">{{degree}}</h3>
                  <span class="date">Expected {{formatDate graduationDate}}</span>
                </div>
                <p class="school">{{school}}, {{location}}</p>
                {{#if gpa}}
                  <p class="gpa">GPA: {{gpa}}/4.0</p>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if experiences}}
          <section class="section">
            <h2 class="section-title">Experience</h2>
            {{#each experiences}}
              <div class="experience-item">
                <div class="item-header">
                  <h3 class="job-title">{{jobTitle}}</h3>
                  <span class="date">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
                </div>
                <p class="company">{{company}}, {{location}}</p>
                {{#if description}}
                  <p class="description">{{description}}</p>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if skills}}
          <section class="section">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
              {{#each skills}}
                <div class="skill-item">{{name}}</div>
              {{/each}}
            </div>
          </section>
        {{/if}}

        <section class="section">
          <h2 class="section-title">Projects</h2>
          <div class="project-item">
            <h3 class="project-title">Personal Portfolio Website</h3>
            <p class="project-description">Developed a responsive portfolio website using HTML, CSS, and JavaScript</p>
          </div>
        </section>
      </div>
    </div>
  `,
  css: `
    .student-resume {
      font-family: 'Arial', sans-serif;
      color: #333;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 3px solid #3498db;
    }

    .name {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .contact-info {
      font-size: 0.95rem;
      color: #7f8c8d;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #3498db;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .objective {
      font-size: 1rem;
      color: #555;
      margin: 0;
      text-align: justify;
    }

    .education-item, .experience-item, .project-item {
      margin-bottom: 1.5rem;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }

    .degree, .job-title, .project-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .date {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-style: italic;
    }

    .school, .company {
      color: #7f8c8d;
      margin: 0.25rem 0;
      font-weight: 500;
    }

    .gpa {
      color: #3498db;
      font-weight: 600;
      margin: 0.25rem 0 0 0;
      font-size: 0.9rem;
    }

    .description, .project-description {
      color: #555;
      margin: 0.5rem 0 0 0;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5rem;
    }

    .skill-item {
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 5px;
      border-left: 3px solid #3498db;
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 600px) {
      .student-resume {
        padding: 1.5rem;
      }

      .name {
        font-size: 1.8rem;
      }

      .item-header {
        flex-direction: column;
        gap: 0.25rem;
      }

      .skills-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  isCustom: false
};

const sidebarTemplate: Template = {
  id: 'sidebar-modern',
  name: 'Sidebar',
  description: 'Two-column layout with dark sidebar',
  preview: '/lovable-uploads/sidebar.png',
  hasPhoto: true,
  isHandlebars: true,
  html: `
    <div class="sidebar-resume">
      <div class="sidebar">
        {{#if_has_photo hasPhoto}}
          {{#if profileImage}}
            <div class="profile-photo">
              <img src="{{profileImage}}" alt="Profile Photo" />
            </div>
          {{/if}}
        {{/if_has_photo}}
        
        <div class="profile-info">
          <h1 class="name">{{fullName}}</h1>
          {{#if experiences.[0].jobTitle}}
            <p class="title">{{experiences.[0].jobTitle}}</p>
          {{/if}}
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">Profile</h3>
          {{#if summary}}
            <p class="profile-text">{{summary}}</p>
          {{/if}}
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">Contact</h3>
          <div class="contact-list">
            {{#if phone}}
              <div class="contact-item">
                <span class="icon">📞</span>
                <span>{{phone}}</span>
              </div>
            {{/if}}
            {{#if email}}
              <div class="contact-item">
                <span class="icon">✉️</span>
                <span>{{email}}</span>
              </div>
            {{/if}}
            {{#if location}}
              <div class="contact-item">
                <span class="icon">📍</span>
                <span>{{location}}</span>
              </div>
            {{/if}}
          </div>
        </div>

        {{#if skills}}
          <div class="sidebar-section">
            <h3 class="sidebar-title">Skills</h3>
            <div class="skills-list">
              {{#each skills}}
                <div class="skill-item">{{name}}</div>
              {{/each}}
            </div>
          </div>
        {{/if}}
      </div>

      <div class="main-content">
        {{#if experiences}}
          <section class="main-section">
            <h2 class="main-title">Work Experience</h2>
            {{#each experiences}}
              <div class="experience-item">
                <div class="experience-header">
                  <h3 class="job-title">{{jobTitle}}</h3>
                  <span class="date-range">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
                </div>
                <p class="company">{{company}} • {{location}}</p>
                {{#if description}}
                  <p class="job-description">{{description}}</p>
                {{/if}}
              </div>
            {{/each}}
          </section>
        {{/if}}

        {{#if education}}
          <section class="main-section">
            <h2 class="main-title">Education</h2>
            {{#each education}}
              <div class="education-item">
                <div class="education-header">
                  <h3 class="degree">{{degree}}</h3>
                  <span class="graduation-date">{{formatDate graduationDate}}</span>
                </div>
                <p class="school">{{school}} • {{location}}</p>
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
    .sidebar-resume {
      display: flex;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 100vh;
      margin: 0;
    }

    .sidebar {
      width: 300px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 1.5rem;
    }

    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 2rem;
      border: 4px solid rgba(255, 255, 255, 0.3);
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-info {
      text-align: center;
      margin-bottom: 2rem;
    }

    .name {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .title {
      opacity: 0.9;
      margin: 0;
      font-size: 1rem;
    }

    .sidebar-section {
      margin-bottom: 2rem;
    }

    .sidebar-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      padding-bottom: 0.5rem;
    }

    .profile-text {
      font-size: 0.9rem;
      line-height: 1.6;
      opacity: 0.9;
      margin: 0;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .icon {
      width: 20px;
      text-align: center;
    }

    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skill-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
      border-radius: 5px;
      font-size: 0.9rem;
      text-align: center;
    }

    .main-content {
      flex: 1;
      padding: 2.5rem;
      background: white;
    }

    .main-section {
      margin-bottom: 2.5rem;
    }

    .main-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .experience-item, .education-item {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .experience-item:last-child, .education-item:last-child {
      border-bottom: none;
    }

    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }

    .job-title, .degree {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .date-range, .graduation-date {
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 500;
      background: rgba(102, 126, 234, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
    }

    .company, .school {
      color: #666;
      margin: 0.25rem 0 0.75rem 0;
      font-weight: 500;
    }

    .job-description {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }

    .gpa {
      color: #667eea;
      font-weight: 500;
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
    }

    @media (max-width: 900px) {
      .sidebar-resume {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .profile-info {
        text-align: left;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .profile-photo {
        width: 100px;
        height: 100px;
        margin: 0;
      }

      .main-content {
        padding: 2rem 1.5rem;
      }

      .experience-header, .education-header {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `,
  isCustom: false
};

export const defaultTemplates: Template[] = [
  modernTemplate,
  professionalTemplate,
  creativeTemplate,
  sidebarTemplate,
  elegantTemplate,
  studentTemplate,
  minimalTemplate
];
