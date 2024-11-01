import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleVerification } from "@/lib/actions/user.action";

const EmailVerificationPage = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await handleVerification();
        setVerificationStatus('success');
        // Successful verification redirects to dashboard via handleVerification
      } catch (error) {
        console.error('Verification failed:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail(); // Call verification on component mount

  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {verificationStatus === 'verifying' && (
            <>
              <div className="mb-4">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mx-auto"
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
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Verifying your email...
              </h2>
              <p className="mt-2 text-gray-600">
                Please wait while we verify your email address
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="mb-4 text-green-500">
                <svg
                  className="h-12 w-12 mx-auto"
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
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Email Verified!
              </h2>
              <p className="mt-2 text-gray-600">
                Redirecting you to the dashboard...
              </p>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="mb-4 text-red-500">
                <svg
                  className="h-12 w-12 mx-auto"
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
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Verification Failed
              </h2>
              <p className="mt-2 text-gray-600">
                There was a problem verifying your email
              </p>
              <button
                onClick={() => router.push('/resend-verification')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Resend Verification Email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
