
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Check if this is a resume-related 404
  const isResumeRoute = location.pathname.includes('/edit-resume/') || 
                       location.pathname.includes('/resume-preview/') ||
                       location.pathname.includes('/resume/edit/');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md mx-auto w-full">
        <div className="w-64 h-64 mx-auto mb-8">
          <DotLottieReact
            src="https://lottie.host/f8a25394-eaa3-4f9f-b6ba-030e4def25bd/3EBiYfu5fY.lottie"
            loop
            autoplay
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        
        {isResumeRoute && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              The resume you're looking for doesn't exist or may have been deleted.
            </p>
          </div>
        )}
        
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
        
        {isResumeRoute && (
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/resume')}
              variant="link"
              className="text-blue-600 hover:text-blue-700"
            >
              View All Resumes →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
