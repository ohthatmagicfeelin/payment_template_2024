import { Link } from 'react-router-dom';

export function LandingDisplay() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-[#1B2F3C]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8
            bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-teal-200 dark:via-teal-100 dark:to-teal-200
            bg-clip-text text-transparent">
            Your App Name
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-teal-200/70 mb-12 max-w-3xl mx-auto">
            A powerful solution for your needs. Start building something amazing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl
                bg-gradient-to-br from-teal-500 to-cyan-600
                dark:from-teal-400 dark:to-cyan-600
                text-white font-medium text-lg
                shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
                transform transition-all duration-200
                hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
                dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]
                hover:from-teal-600 hover:to-cyan-700
                dark:hover:from-teal-500 dark:hover:to-cyan-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl
                bg-gray-50 dark:bg-gray-800/50
                text-gray-700 dark:text-teal-200 font-medium text-lg
                shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
                transform transition-all duration-200
                hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
                dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Feature One',
              description: 'Description of your first amazing feature and how it helps users.'
            },
            {
              title: 'Feature Two',
              description: 'Description of your second fantastic feature and its benefits.'
            },
            {
              title: 'Feature Three',
              description: 'Description of your third outstanding feature and what it offers.'
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl
              bg-gray-50 dark:bg-gray-800/50
              shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
              dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-teal-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-teal-200/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
