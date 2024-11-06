import FeedbackButton from '../components/Feedback/FeedbackButton';

const MainLayout = ({ children }) => {
  return (
    <div>
      {children}
      <FeedbackButton />
    </div>
  );
};

export default MainLayout; 