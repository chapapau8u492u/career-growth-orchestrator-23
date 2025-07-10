import Handlebars from 'handlebars';
import DOMPurify from 'dompurify';

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
  profileImage?: string;
  experiences: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  hasPhoto: boolean;
  html: string;
  css: string;
  js?: string;
  isCustom?: boolean;
  isHandlebars?: boolean;
  isDefault?: boolean;
}

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', function(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
});

Handlebars.registerHelper('eq', function(a: any, b: any) {
  return a === b;
});

Handlebars.registerHelper('if_has_photo', function(hasPhoto: boolean, options: any) {
  if (hasPhoto) {
    return options.fn(this);
  }
  return options.inverse(this);
});

export class TemplateEngine {
  static processTemplate(template: Template, data: ResumeData): string {
    try {
      // If it's a Handlebars template, process it
      if (template.isHandlebars && template.html.includes('{{')) {
        const compiledTemplate = Handlebars.compile(template.html);
        const processedHtml = compiledTemplate(data);
        
        // Sanitize the output to prevent XSS
        return DOMPurify.sanitize(processedHtml);
      }
      
      // For non-Handlebars templates, return as is
      return template.html;
    } catch (error) {
      console.error('Template processing error:', error);
      return `<div class="error">Template Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
  }

  static validateTemplate(html: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      // Check for basic Handlebars syntax
      Handlebars.compile(html);
      
      // Check for potentially dangerous content
      if (html.includes('<script>') || html.includes('javascript:')) {
        errors.push('JavaScript code is not allowed in templates for security reasons');
      }
      
      if (html.includes('onclick') || html.includes('onerror')) {
        errors.push('Event handlers are not allowed in templates');
      }
      
    } catch (error) {
      errors.push(`Handlebars syntax error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static generatePreviewHtml(template: Template, data: ResumeData): string {
    const processedHtml = this.processTemplate(template, data);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.name} Template</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
          }
          .template-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          ${template.css}
        </style>
      </head>
      <body>
        <div class="template-container">
          ${processedHtml}
        </div>
        ${template.js ? `<script>${template.js}</script>` : ''}
      </body>
      </html>
    `;
  }
}
