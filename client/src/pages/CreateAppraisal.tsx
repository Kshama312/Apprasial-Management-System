import React from 'react';
import { Navbar } from '../components/Navigation/Navbar';
import { AppraisalForm } from '../components/Appraisal/AppraisalForm';

export const CreateAppraisal: React.FC = () => {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-xl rounded-lg border border-indigo-200">
          <h2 className="text-3xl font-semibold text-indigo-800 text-center mb-6">
            Create a New Self Appraisal
          </h2>
          <AppraisalForm />
        </div>
      </div>
    </div>
  );
};
