
import React from 'react';
import { RefreshCircle, DangerTriangle } from '@solar-icons/react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DangerTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-montserrat-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCircle className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;