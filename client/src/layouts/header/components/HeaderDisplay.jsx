import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FaUser, FaSignOutAlt, FaMoon, FaSun, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export function HeaderDisplay({
  user,
  isDarkMode,
  onThemeToggle,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
      border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 
              bg-clip-text text-transparent"
          >
            Your Logo
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={onThemeToggle}
              className="p-2 rounded-lg
                text-gray-600 dark:text-teal-200
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button
                  className="flex items-center gap-2 p-2 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 
                    flex items-center justify-center text-sm font-medium text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-gray-700 dark:text-teal-50">
                    {user.email}
                  </span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl
                    bg-white dark:bg-gray-800
                    shadow-lg ring-1 ring-black ring-opacity-5
                    dark:ring-white dark:ring-opacity-10
                    focus:outline-none"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`flex items-center gap-2 px-4 py-2
                              ${active 
                                ? 'bg-gray-100 dark:bg-gray-700/50 text-teal-500'
                                : 'text-gray-700 dark:text-teal-200'
                              }`}
                          >
                            <FaUser className="w-4 h-4" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`flex items-center gap-2 px-4 py-2
                              ${active 
                                ? 'bg-gray-100 dark:bg-gray-700/50 text-teal-500'
                                : 'text-gray-700 dark:text-teal-200'
                              }`}
                          >
                            <FaUser className="w-4 h-4" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Separator className="my-1 border-t border-gray-200 dark:border-gray-700" />

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onLogout}
                            className={`flex items-center gap-2 px-4 py-2 w-full
                              ${active 
                                ? 'bg-gray-100 dark:bg-gray-700/50 text-red-500'
                                : 'text-gray-700 dark:text-teal-200'
                              }`}
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/login"
                  className="sm:px-4 sm:py-2 p-2 rounded-lg
                    text-gray-700 dark:text-teal-200 
                    hover:text-teal-500 dark:hover:text-teal-400 
                    transition-colors"
                >
                  <FaSignInAlt className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline font-medium">Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="sm:px-4 sm:py-2 p-2 rounded-lg
                    bg-gradient-to-r from-teal-500 to-cyan-500
                    text-white font-medium
                    hover:opacity-90 transition-all"
                >
                  <FaUserPlus className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline">Sign up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 