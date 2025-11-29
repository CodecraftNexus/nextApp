"use client";
import React, { useState } from 'react';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function UsernameModal({ 
  isOpen, 
  onSubmit, 
  loading = false,
  error 
}: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const validateUsername = (value: string): boolean => {
    setValidationError('');
    
    if (value.length < 3 || value.length > 20) {
      setValidationError('Username must be between 3-20 characters');
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9](?!.*[._-]{2})[a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
    if (!usernameRegex.test(value)) {
      setValidationError('Username can only contain letters, numbers, dots, underscores, and hyphens. Cannot start/end with special characters.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateUsername(username)) {
      await onSubmit(username);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            One More Step! 🎉
          </h2>
          <p className="text-gray-600 text-sm">
            Please choose a unique username to complete your registration
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              onKeyDown={handleKeyPress}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              minLength={3}
              maxLength={20}
              disabled={loading}
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              3-20 characters • Letters, numbers, dots, underscores, hyphens
            </p>
          </div>

          {(validationError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                {validationError || error}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !username}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Setting username...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}