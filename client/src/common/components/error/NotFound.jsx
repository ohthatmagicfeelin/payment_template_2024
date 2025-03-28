import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold 
            bg-gradient-to-r from-teal-500 to-cyan-500 
            dark:from-teal-400 dark:to-cyan-400 
            text-transparent bg-clip-text">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-teal-50 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-teal-200/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Navigation Links */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
              bg-gray-50 dark:bg-gray-800/50
              text-gray-700 dark:text-teal-200
              shadow-[3px_3px_6px_rgba(0,0,0,0.1),_-3px_-3px_6px_rgba(255,255,255,0.9)]
              dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),_-3px_-3px_6px_rgba(255,255,255,0.05)]
              hover:opacity-90 transition-opacity"
          >
            <FaHome className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;