"use client";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn’t load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-sm p-8 text-center space-y-5">
        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M6.938 4h10.124c1.54 0 2.502 1.667 1.732 3L13.732 19c-.77 1.333-2.694 1.333-3.464 0L5.206 7c-.77-1.333.192-3 1.732-3z"
            />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
