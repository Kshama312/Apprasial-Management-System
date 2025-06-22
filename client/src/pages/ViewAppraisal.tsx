import React from 'react';
import { Navbar } from '../components/Navigation/Navbar';
import { AppraisalDetails } from '../components/Appraisal/AppraisalDetails';

export const ViewAppraisal: React.FC = () => {
  return (
    <div className="bg-blue-50 min-h-screen"> {/* Add background color here */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppraisalDetails />
      </div>
    </div>
  );
};
