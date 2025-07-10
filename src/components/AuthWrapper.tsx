
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  return (
    <>
      <SignedOut>
        {children}
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen">
          {children}
        </div>
      </SignedIn>
    </>
  );
};

export default AuthWrapper;
