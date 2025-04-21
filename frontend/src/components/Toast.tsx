import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XIcon } from '@heroicons/react/solid';
import { Transition } from '@headlessui/react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    error: <XCircleIcon className="h-6 w-6 text-red-400" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900',
    error: 'bg-red-50 dark:bg-red-900',
    info: 'bg-blue-50 dark:bg-blue-900',
  };

  const textColors = {
    success: 'text-green-800 dark:text-green-100',
    error: 'text-red-800 dark:text-red-100',
    info: 'text-blue-800 dark:text-blue-100',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Transition
        show={isVisible}
        enter="transition-transform duration-300 ease-out"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition-transform duration-300 ease-in"
        leaveFrom="translate-y-0 opacity-100 sm:translate-x-0"
        leaveTo="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      >
        <div
          className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${bgColors[type]}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">{icons[type]}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`rounded-md inline-flex ${textColors[type]} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  onClick={onClose}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Toast; 