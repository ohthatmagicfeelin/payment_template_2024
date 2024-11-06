import { useState } from 'react';
import FeedbackButton from './FeedbackButton';
import FeedbackModal from './FeedbackModal';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FeedbackButton onClick={() => setIsOpen(true)} />
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FeedbackWidget; 