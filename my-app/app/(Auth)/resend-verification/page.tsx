import React, { useState } from "react";
import { resendVerificationEmail } from "@/lib/actions/user.action";

const ResendVerificationPage = () => {
  const [status, setStatus] = useState('idle'); // Status can be: 'idle', 'sending', 'success', 'error'

  const handleResendClick = async () => {
    setStatus('sending');
    try {
      await resendVerificationEmail();
      setStatus('success');
    } catch (error) {
      console.error('Resend failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'idle' && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Resend Verification Email
            </h2>
            <p className="text-gray-600 mb-6">
              Didn’t receive your verification email? Click the button below to resend it.
            </p>
            <button
              onClick={handleResendClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Resend Email
            </button>
          </>
        )}

        {status === 'sending' && (
          <div className="text-blue-600">
            <svg
              className="animate-spin h-12 w-12 mx-auto mb-4"
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
            <p>Sending verification email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-500">
            <svg
              className="h-12 w-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-semibold">Email Sent!</h2>
            <p className="text-gray-600 mt-2">
              Please check your inbox for the verification email.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-500">
            <svg
              className="h-12 w-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h2 className="text-2xl font-semibold">Error Sending Email</h2>
            <p className="text-gray-600 mt-2">
              There was a problem resending the verification email. Please try again.
            </p>
            <button
              onClick={handleResendClick}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResendVerificationPage;
