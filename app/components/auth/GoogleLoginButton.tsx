"use client";
import React, { useEffect, useRef } from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: (error: any) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError,
  text = 'continue_with'
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);


  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {

    const loadGoogleScript = () => {
      if (scriptLoaded.current) return;

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
      scriptLoaded.current = true;
    };

    const initializeGoogleSignIn = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: buttonRef.current.offsetWidth || 320,
          text: text,
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    };

    const handleGoogleResponse = (response: any) => {
      try {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          throw new Error('No credential received');
        }
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        if (onError) {
          onError(error);
        }
      }
    };


    if (typeof window !== 'undefined') {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        loadGoogleScript();
      }
    }


    return () => {
    };
  }, [onSuccess, onError, text]);

  return (
    <div 
      ref={buttonRef} 
      className="w-full flex items-center justify-center min-h-[40px]"
    />
  );
}