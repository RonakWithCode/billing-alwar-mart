import React from 'react';

const Toast = ({ show, text }) => {
  if (!show) {
    return null; // Do not render anything if `show` is false
  }

  return (
    <div className="fixed top-0 right-0 m-4 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg" role="alert">
      <div className="flex items-center p-4">
        <div className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="ms-3 text-sm text-gray-700">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Toast;
