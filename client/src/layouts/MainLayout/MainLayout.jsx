import { Header } from '@/layouts/MainLayout/components/Header';
import { FeedbackContainer } from '@/features/feedback/components/FeedbackContainer.js';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper';

export function MainLayout({ children }) {
  return (
    <ThemeWrapper>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <FeedbackContainer />
    </ThemeWrapper>
  );
} 