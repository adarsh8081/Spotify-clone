import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ExclamationCircleIcon className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 