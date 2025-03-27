import { useHeader } from '@/layouts/header/hooks/useHeader';
import { HeaderDisplay } from '@/layouts/header/components/HeaderDisplay';

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