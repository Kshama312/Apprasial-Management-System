import React from 'react';
import { Navbar } from '../components/Navigation/Navbar';
import { FeedbackForm } from '../components/Appraisal/FeedbackForm';

export const GiveFeedback: React.FC = () => {
  return (
    <div className="bg-blue-50 min-h-screen"> {/* Add background color here */}
      {/* Navbar component */}
      <Navbar />

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeedbackForm />
      </div>
    </div>
  );
};
