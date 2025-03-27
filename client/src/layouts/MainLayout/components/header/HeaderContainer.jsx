import { useHeader } from './hooks/useHeader';
import { HeaderDisplay } from './HeaderDisplay';

export function HeaderContainer() {
  const {
    user,
    isDarkMode,
    toggleTheme,
    handleLogout
  } = useHeader();

  return (
    <HeaderDisplay
      user={user}
      isDarkMode={isDarkMode}
      onThemeToggle={toggleTheme}
      onLogout={handleLogout}
    />
  );
} 