
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            StudentOS
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-700"
            >
              Dashboard
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            StudentOS
          </span>
          <br />
          <span className="text-gray-900">
            AI-Powered Career & Academic
          </span>
          <br />
          <span className="text-gray-900">Companion</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-4xl leading-relaxed">
          Your unified platform for resume building, job tracking, AI mentoring, and academic success. Build 
          your future with intelligent tools designed for students.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Open Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Open Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </SignedIn>
          
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-3 rounded-xl text-lg font-medium border-2 border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            Learn More
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
