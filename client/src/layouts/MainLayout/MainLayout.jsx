import { HeaderContainer } from '@/layouts/MainLayout/components/header/HeaderContainer';
// import { FeedbackContainer } from '@/features/feedback/components/FeedbackContainer.js';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper';

export function MainLayout({ children }) {
  return (
    <ThemeWrapper>
      <HeaderContainer />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      {/* <FeedbackContainer /> */}
    </ThemeWrapper>
  );
} 