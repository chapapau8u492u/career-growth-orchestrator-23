import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, User, Star, Calendar, Award, Briefcase, GraduationCap } from "lucide-react";
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
  profileImage?: string;
}
interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}
interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}
interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
interface ResumePreviewPanelProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  template: 'modern' | 'professional' | 'creative' | 'minimal' | 'colorful' | 'sidebar' | 'elegant' | 'ats' | 'student';
  accentColor: string;
}
const ResumePreviewPanel = ({
  personalInfo,
  experiences,
  education,
  skills,
  template,
  accentColor
}: ResumePreviewPanelProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };
  const formatBulletPoints = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return <li key={index} className="ml-4 text-sm">
            {trimmedLine.substring(1).trim()}
          </li>;
      }
      return trimmedLine ? <p key={index} className="mb-1 text-sm">{trimmedLine}</p> : null;
    });
  };

  // Template 1: Modern (Blue gradient header)
  const ModernTemplate = () => <div className="bg-white shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm',
    padding: '20mm'
  }}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg flex items-start gap-6 -mx-5 -mt-5 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {experiences[0]?.jobTitle && <p className="text-lg opacity-90 mb-3">{experiences[0].jobTitle}</p>}
          <div className="flex flex-wrap gap-3 text-sm opacity-90">
            {personalInfo.phone && <div className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                {personalInfo.phone}
              </div>}
            {personalInfo.email && <div className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {personalInfo.email}
              </div>}
            {personalInfo.location && <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {personalInfo.location}
              </div>}
          </div>
        </div>
        
        {personalInfo.profileImage && <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
            <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>}
      </div>

      <div className="space-y-6">
        {personalInfo.summary && <section>
            <h2 className="text-lg font-bold mb-2 border-b pb-1" style={{
          color: accentColor,
          borderColor: accentColor
        }}>
              PROFESSIONAL SUMMARY
            </h2>
            <div className="text-gray-700 text-sm leading-relaxed">
              {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                  {formatBulletPoints(personalInfo.summary)}
                </ul> : <p>{personalInfo.summary}</p>}
            </div>
          </section>}

        {experiences && experiences.length > 0 && experiences[0].jobTitle && <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{
          color: accentColor,
          borderColor: accentColor
        }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experiences.map(exp => <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-700">{exp.jobTitle}</h3>
                      <p className="font-medium" style={{
                  color: accentColor
                }}>{exp.company}</p>
                    </div>
                    <div className="text-xs text-gray-700 mt-1 sm:mt-0">
                      <p>{exp.location}</p>
                      <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    </div>
                  </div>
                  {exp.description && <div className="text-gray-700 leading-relaxed">
                      <ul className="list-none">
                        {formatBulletPoints(exp.description)}
                      </ul>
                    </div>}
                </div>)}
            </div>
          </section>}

        {education && education.length > 0 && education[0].degree && <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{
          color: accentColor,
          borderColor: accentColor
        }}>
              EDUCATION
            </h2>
            <div className="space-y-3">
              {education.map(edu => <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-700">{edu.degree}</h3>
                    <p style={{
                color: accentColor
              }}>{edu.school}</p>
                    {edu.gpa && <p className="text-xs text-gray-700">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-xs text-gray-700 mt-1 sm:mt-0">
                    <p>{edu.location}</p>
                    <p>{formatDate(edu.graduationDate)}</p>
                  </div>
                </div>)}
            </div>
          </section>}

        {skills && skills.length > 0 && <section>
            <h2 className="text-lg font-bold mb-3 border-b pb-1" style={{
          color: accentColor,
          borderColor: accentColor
        }}>
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => <Badge key={skill.id} variant="secondary" className="text-xs px-2 py-1" style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor
          }}>
                  {skill.name}
                </Badge>)}
            </div>
          </section>}
      </div>
    </div>;

  // Template 2: Professional (Dark sidebar with photo)
  const ProfessionalTemplate = () => <div className="bg-white flex shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="w-1/3 bg-slate-800 text-white p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {personalInfo.profileImage ? <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-slate-300" />}
          </div>
          <h1 className="text-2xl font-bold text-white">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-slate-300 mt-2">{experiences[0]?.jobTitle || 'Your Title'}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
          <div className="space-y-2 text-sm">
            {personalInfo.location && <div>
                <span className="text-slate-300 block">Address</span>
                <p className="text-white">{personalInfo.location}</p>
              </div>}
            {personalInfo.phone && <div>
                <span className="text-slate-300 block">Phone</span>
                <p className="text-white">{personalInfo.phone}</p>
              </div>}
            {personalInfo.email && <div>
                <span className="text-slate-300 block">Email</span>
                <p className="text-white break-all">{personalInfo.email}</p>
              </div>}
          </div>
        </div>

        {skills && skills.length > 0 && <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Skills</h3>
            <ul className="space-y-2">
              {skills.map(skill => <li key={skill.id} className="text-sm text-slate-300">• {skill.name}</li>)}
            </ul>
          </div>}
      </div>

      <div className="w-2/3 p-6">
        {personalInfo.summary && <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Profile</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                  {formatBulletPoints(personalInfo.summary)}
                </ul> : <p>{personalInfo.summary}</p>}
            </div>
          </div>}

        {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
            {experiences.map(exp => <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <div className="text-gray-700 leading-relaxed">
                    <ul className="list-none ml-4">
                      {formatBulletPoints(exp.description)}
                    </ul>
                  </div>}
              </div>)}
          </div>}

        {education && education.length > 0 && education[0].degree && <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            {education.map(edu => <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;

  // Template 3: Creative Orange
  const CreativeTemplate = () => <div className="bg-orange-50 p-8 shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
          {personalInfo.profileImage ? <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-orange-600" />}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-lg text-orange-600 mt-1">{experiences[0]?.jobTitle || 'Your Title'}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          {personalInfo.summary && <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">ABOUT</span>
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                    {formatBulletPoints(personalInfo.summary)}
                  </ul> : <p>{personalInfo.summary}</p>}
              </div>
            </div>}

          {education && education.length > 0 && education[0].degree && <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">EDUCATION</span>
              </h2>
              {education.map(edu => <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
                </div>)}
            </div>}
        </div>

        <div>
          {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">EXPERIENCE</span>
              </h2>
              {experiences.map(exp => <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-orange-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && <div className="text-gray-700 leading-relaxed">
                      <ul className="list-none">
                        {formatBulletPoints(exp.description)}
                      </ul>
                    </div>}
                </div>)}
            </div>}

          {skills && skills.length > 0 && <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">SKILLS</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => <span key={skill.id} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {skill.name}
                  </span>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;

  // Template 4: Student - Dark with Yellow Accents
  const StudentTemplate = () => <div className="bg-gray-900 text-white p-8 shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center overflow-hidden">
          {personalInfo.profileImage ? <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-900" />}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-lg text-yellow-400 mt-1">{experiences[0]?.jobTitle || 'Your Title'}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          {personalInfo.summary && <div className="mb-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b-2 border-yellow-400 pb-1">ABOUT</h2>
              <div className="text-sm text-gray-300 leading-relaxed">
                {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                    {formatBulletPoints(personalInfo.summary)}
                  </ul> : <p>{personalInfo.summary}</p>}
              </div>
            </div>}

          {education && education.length > 0 && education[0].degree && <div className="mb-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b-2 border-yellow-400 pb-1">EDUCATION</h2>
              {education.map(edu => <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold text-white">{edu.degree}</h3>
                  <p className="text-gray-300">{edu.school}</p>
                  <p className="text-sm text-gray-400">{formatDate(edu.graduationDate)}</p>
                </div>)}
            </div>}
        </div>

        <div>
          {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b-2 border-yellow-400 pb-1">EXPERIENCE</h2>
              {experiences.map(exp => <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{exp.jobTitle}</h3>
                      <p className="text-yellow-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && <div className="text-gray-300 leading-relaxed">
                      <ul className="list-none">
                        {formatBulletPoints(exp.description)}
                      </ul>
                    </div>}
                </div>)}
            </div>}

          {skills && skills.length > 0 && <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b-2 border-yellow-400 pb-1">SKILLS</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => <span key={skill.id} className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.name}
                  </span>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;

  // Template 5: Minimal Clean
  const MinimalTemplate = () => <div className="bg-white p-8 shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="text-center mb-8">
        {personalInfo.profileImage && <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
            <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mb-4">{experiences[0]?.jobTitle || 'Your Title'}</p>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">SUMMARY</h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                {formatBulletPoints(personalInfo.summary)}
              </ul> : <p>{personalInfo.summary}</p>}
          </div>
        </div>}

      {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EXPERIENCE</h2>
          {experiences.map(exp => <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && <div className="text-gray-700 leading-relaxed">
                  <ul className="list-none">
                    {formatBulletPoints(exp.description)}
                  </ul>
                </div>}
            </div>)}
        </div>}

      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && education[0].degree && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
            {education.map(edu => <div key={edu.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
              </div>)}
          </div>}

        {skills && skills.length > 0 && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  {skill.name}
                </span>)}
            </div>
          </div>}
      </div>
    </div>;

  // Template 6: Sidebar (same as Professional but different color scheme)
  const SidebarTemplate = () => <div className="bg-white flex shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="w-1/3 bg-blue-900 text-white p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {personalInfo.profileImage ? <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-blue-300" />}
          </div>
          <h1 className="text-2xl font-bold text-white">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-blue-300 mt-2">{experiences[0]?.jobTitle || 'Your Title'}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
          <div className="space-y-2 text-sm">
            {personalInfo.location && <div>
                <span className="text-slate-300 block">Address</span>
                <p className="text-white">{personalInfo.location}</p>
              </div>}
            {personalInfo.phone && <div>
                <span className="text-slate-300 block">Phone</span>
                <p className="text-white">{personalInfo.phone}</p>
              </div>}
            {personalInfo.email && <div>
                <span className="text-slate-300 block">Email</span>
                <p className="text-white break-all">{personalInfo.email}</p>
              </div>}
          </div>
        </div>

        {skills && skills.length > 0 && <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Skills</h3>
            <ul className="space-y-2">
              {skills.map(skill => <li key={skill.id} className="text-sm text-slate-300">• {skill.name}</li>)}
            </ul>
          </div>}
      </div>

      <div className="w-2/3 p-6">
        {personalInfo.summary && <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Profile</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                  {formatBulletPoints(personalInfo.summary)}
                </ul> : <p>{personalInfo.summary}</p>}
            </div>
          </div>}

        {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
            {experiences.map(exp => <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <div className="text-gray-700 leading-relaxed">
                    <ul className="list-none ml-4">
                      {formatBulletPoints(exp.description)}
                    </ul>
                  </div>}
              </div>)}
          </div>}

        {education && education.length > 0 && education[0].degree && <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            {education.map(edu => <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</span>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;

  // Template 7: Elegant (Purple theme)
  const ElegantTemplate = () => <div className="bg-white p-8 shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="border-b-4 border-purple-600 pb-6 mb-8">
        <div className="flex items-center gap-6">
          {personalInfo.profileImage && <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-600">
              <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-lg text-purple-600 mt-1">{experiences[0]?.jobTitle || 'Your Title'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{personalInfo.location}</span>}
            </div>
          </div>
        </div>
      </div>

      {personalInfo.summary && <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary.includes('•') ? <ul className="list-none space-y-1">
                {formatBulletPoints(personalInfo.summary)}
              </ul> : <p>{personalInfo.summary}</p>}
          </div>
        </div>}

      {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EXPERIENCE</h2>
          {experiences.map(exp => <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && <div className="text-gray-700 leading-relaxed">
                  <ul className="list-none">
                    {formatBulletPoints(exp.description)}
                  </ul>
                </div>}
            </div>)}
        </div>}

      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && education[0].degree && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
            {education.map(edu => <div key={edu.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
              </div>)}
          </div>}

        {skills && skills.length > 0 && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  {skill.name}
                </span>)}
            </div>
          </div>}
      </div>
    </div>;

  // Template 8: ATS-Friendly (Simple black and white)
  const ATSTemplate = () => <div className="bg-white p-8 shadow-lg" style={{
    width: '210mm',
    minHeight: '297mm'
  }}>
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-black mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-700 mb-2">{experiences[0]?.jobTitle || 'Your Title'}</p>
        <div className="text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && personalInfo.email && <span> | </span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && (personalInfo.email || personalInfo.phone) && <span> | </span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-2 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm text-gray-700">{personalInfo.summary}</p>
        </div>}

      {experiences && experiences.length > 0 && experiences[0].jobTitle && <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-2 border-b border-gray-300 pb-1">EXPERIENCE</h2>
          {experiences.map(exp => <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-black">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && <div className="text-gray-700 leading-relaxed">
                  <ul className="list-none">
                    {formatBulletPoints(exp.description)}
                  </ul>
                </div>}
            </div>)}
        </div>}

      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && education[0].degree && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
            {education.map(edu => <div key={edu.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{formatDate(edu.graduationDate)}</p>
              </div>)}
          </div>}

        {skills && skills.length > 0 && <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => <span key={skill.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  {skill.name}
                </span>)}
            </div>
          </div>}
      </div>
    </div>;

  // Template selection based on template prop
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate />;
      case 'professional':
        return <ProfessionalTemplate />;
      case 'sidebar':
        return <SidebarTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'student':
        return <StudentTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'elegant':
        return <ElegantTemplate />;
      case 'ats':
        return <ATSTemplate />;
      default:
        return <ModernTemplate />;
    }
  };
  return <div className="h-full overflow-y-auto bg-gray-100">
      <div className="flex justify-center p-6">
        <div className="bg-white shadow-2xl" style={{
        width: '210mm',
        minHeight: '297mm',
        transform: 'scale(0.75)',
        transformOrigin: 'top center',
        marginBottom: '-25%'
      }}>
          {renderTemplate()}
        </div>
        
        {!personalInfo.fullName && !personalInfo.summary && (!experiences || experiences.length === 0 || !experiences[0].jobTitle) && (!education || education.length === 0 || !education[0].degree) && (!skills || skills.length === 0) && <div className="absolute inset-0 flex items-center justify-center bg-white/90 hidden">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2 text-gray-500">Your Resume Preview</h3>
              <p className="text-sm text-gray-400">Start filling out the form to see your resume come to life!</p>
            </div>
          </div>}
      </div>
    </div>;
};
export default ResumePreviewPanel;