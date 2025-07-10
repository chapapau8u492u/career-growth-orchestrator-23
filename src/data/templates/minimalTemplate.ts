
import { Template } from '../../utils/templateEngine';

export const minimalTemplate: Template = {
  id: 'minimal-clean',
  name: 'Minimal Clean',
  description: 'Simple and clean design focusing on content',
  preview: '/lovable-uploads/minimal.png',
  hasPhoto: false,
  isHandlebars: true,
  html: `
    <div class="minimal-resume">
      <div class="header">
        <h1 class="name">{{fullName}}</h1>
        {{#if experiences.[0].jobTitle}}
          <p class="title">{{experiences.[0].jobTitle}}</p>
        {{/if}}
        <div class="contact-info">
          {{#if email}}
            <span class="contact-item">{{email}}</span>
          {{/if}}
          {{#if phone}}
            <span class="contact-item">{{phone}}</span>
          {{/if}}
          {{#if location}}
            <span class="contact-item">{{location}}</span>
          {{/if}}
        </div>
      </div>

      {{#if summary}}
        <section class="section">
          <h2 class="section-title">Summary</h2>
          <p class="summary">{{summary}}</p>
        </section>
      {{/if}}

      {{#if experiences}}
        <section class="section">
          <h2 class="section-title">Experience</h2>
          {{#each experiences}}
            <div class="item">
              <div class="item-header">
                <h3 class="item-title">{{jobTitle}} • {{company}}</h3>
                <span class="item-date">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</span>
              </div>
              {{#if description}}
                <p class="item-description">{{description}}</p>
              {{/if}}
            </div>
          {{/each}}
        </section>
      {{/if}}

      {{#if education}}
        <section class="section">
          <h2 class="section-title">Education</h2>
          {{#each education}}
            <div class="item">
              <div class="item-header">
                <h3 class="item-title">{{degree}} • {{school}}</h3>
                <span class="item-date">{{formatDate graduationDate}}</span>
              </div>
              {{#if gpa}}
                <p class="item-description">GPA: {{gpa}}</p>
              {{/if}}
            </div>
          {{/each}}
        </section>
      {{/if}}

      {{#if skills}}
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            {{#each skills}}{{name}}{{#unless @last}}, {{/unless}}{{/each}}
          </div>
        </section>
      {{/if}}
    </div>
  `,
  css: `
    .minimal-resume {
      font-family: 'Georgia', serif;
      color: #333;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #ddd;
    }
    
    .name {
      font-size: 2.5rem;
      font-weight: 400;
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    .title {
      font-size: 1.2rem;
      color: #666;
      margin: 0 0 1rem 0;
      font-style: italic;
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      font-size: 0.95rem;
      color: #666;
    }
    
    .contact-item {
      position: relative;
    }
    
    .contact-item:not(:last-child):after {
      content: "•";
      position: absolute;
      right: -0.75rem;
      color: #ccc;
    }
    
    .section {
      margin-bottom: 2.5rem;
    }
    
    .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 1.5rem 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.5rem;
    }
    
    .summary {
      color: #555;
      margin: 0;
      font-size: 1.05rem;
    }
    
    .item {
      margin-bottom: 1.5rem;
    }
    
    .item:last-child {
      margin-bottom: 0;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }
    
    .item-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: #2c3e50;
    }
    
    .item-date {
      font-size: 0.9rem;
      color: #666;
      font-style: italic;
    }
    
    .item-description {
      color: #555;
      margin: 0;
      font-size: 0.95rem;
    }
    
    .skills-list {
      color: #555;
      font-size: 0.95rem;
      line-height: 1.8;
    }
    
    @media (max-width: 600px) {
      .minimal-resume {
        padding: 1.5rem;
      }
      
      .name {
        font-size: 2rem;
      }
      
      .contact-info {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .contact-item:not(:last-child):after {
        display: none;
      }
      
      .item-header {
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .item-date {
        align-self: flex-start;
      }
    }
  `,
  isCustom: false
};
