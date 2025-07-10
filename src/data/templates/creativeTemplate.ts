
import { Template } from '../../utils/templateEngine';

export const creativeTemplate: Template = {
  id: 'creative-two-column',
  name: 'Creative Two-Column',
  description: 'Professional two-column layout with modern design elements',
  preview: '/lovable-uploads/creative.png',
  hasPhoto: true,
  isHandlebars: true,
  html: `
    <div class="creative-resume">
      <div class="header">
        <div class="header-content">
          <div class="personal-info">
            <h1 class="name">{{fullName}}</h1>
            {{#if experiences.[0].jobTitle}}
              <p class="title">{{experiences.[0].jobTitle}}</p>
            {{/if}}
            <div class="contact-info">
              {{#if email}}
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span>{{email}}</span>
                </div>
              {{/if}}
              {{#if phone}}
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <span>{{phone}}</span>
                </div>
              {{/if}}
              {{#if location}}
                <div class="contact-item">
                  <span class="contact-icon">📍</span>
                  <span>{{location}}</span>
                </div>
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

      <div class="main-content">
        <div class="left-column">
          {{#if experiences}}
            <section class="section">
              <h2 class="section-title">EXPERIENCE</h2>
              {{#each experiences}}
                <div class="experience-item">
                  <h3 class="job-title">{{jobTitle}}</h3>
                  <p class="company">{{company}}</p>
                  <p class="date-location">
                    <span class="date">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
                    <span class="location">{{location}}</span>
                  </p>
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
              <h2 class="section-title">EDUCATION</h2>
              {{#each education}}
                <div class="education-item">
                  <h3 class="degree">{{degree}}</h3>
                  <p class="school">{{school}}</p>
                  <p class="graduation-date">{{formatDate graduationDate}}</p>
                  {{#if gpa}}
                    <p class="gpa">GPA: {{gpa}}</p>
                  {{/if}}
                </div>
              {{/each}}
            </section>
          {{/if}}
        </div>

        <div class="right-column">
          {{#if summary}}
            <section class="section">
              <h2 class="section-title">LIFE PHILOSOPHY</h2>
              <div class="philosophy-box">
                <p class="philosophy-text">{{summary}}</p>
              </div>
            </section>
          {{/if}}

          {{#if skills}}
            <section class="section">
              <h2 class="section-title">STRENGTHS</h2>
              <div class="strengths-container">
                {{#each skills}}
                  <div class="strength-item">
                    <span class="strength-icon">⭐</span>
                    <span class="strength-name">{{name}}</span>
                  </div>
                {{/each}}
              </div>
            </section>
          {{/if}}

          <section class="section">
            <h2 class="section-title">LANGUAGES</h2>
            <div class="language-item">
              <span class="language-name">English</span>
              <div class="language-level">
                <span class="dot filled"></span>
                <span class="dot filled"></span>
                <span class="dot filled"></span>
                <span class="dot filled"></span>
                <span class="dot filled"></span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  css: `
    .creative-resume {
      font-family: 'Arial', sans-serif;
      color: #333;
      line-height: 1.4;
      margin: 0;
      background: white;
    }
    
    .header {
      background: #4a4a4a;
      color: white;
      padding: 2rem;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .personal-info {
      flex: 1;
    }
    
    .name {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .title {
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
      color: #ccc;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    
    .contact-icon {
      width: 20px;
    }
    
    .profile-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid white;
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .main-content {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      gap: 2rem;
      padding: 2rem;
    }
    
    .left-column {
      flex: 2;
    }
    
    .right-column {
      flex: 1;
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 10px;
    }
    
    .section {
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: bold;
      color: #4a4a4a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #4a4a4a;
    }
    
    .experience-item, .education-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .experience-item:last-child, .education-item:last-child {
      border-bottom: none;
    }
    
    .job-title, .degree {
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0 0 0.25rem 0;
      color: #333;
    }
    
    .company, .school {
      color: #666;
      font-weight: 500;
      margin: 0 0 0.5rem 0;
    }
    
    .date-location {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .job-description {
      color: #555;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .philosophy-box {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #4a4a4a;
    }
    
    .philosophy-text {
      font-style: italic;
      color: #555;
      margin: 0;
    }
    
    .strengths-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .strength-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      padding: 0.5rem;
      border-radius: 5px;
    }
    
    .strength-icon {
      color: #4a4a4a;
    }
    
    .language-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 0.75rem;
      border-radius: 5px;
    }
    
    .language-level {
      display: flex;
      gap: 0.25rem;
    }
    
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ddd;
    }
    
    .dot.filled {
      background: #4a4a4a;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .main-content {
        flex-direction: column;
        padding: 1rem;
      }
      
      .name {
        font-size: 2rem;
      }
    }
  `,
  isCustom: false
};
