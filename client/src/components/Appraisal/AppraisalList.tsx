import React from 'react';
import { Link } from 'react-router-dom';
import { Appraisal } from '../../types';
import { Button } from '../Shared/Button';

interface AppraisalListProps {
  appraisals: Appraisal[];
  onAction?: (id: string, action: string) => void;
}

export const AppraisalList: React.FC<AppraisalListProps> = ({ appraisals, onAction }) => {
  if (appraisals.length === 0) {
    return <p className="text-gray-600">No appraisals found.</p>;
  }

  return (
    <div className="bg-blue-50 min-h-screen"> {/* Add background color here */}
      <div className="space-y-4">
        {appraisals.map((appraisal) => (
          <div
            key={appraisal._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                Appraisal ID: {appraisal._id.substring(0, 8)}
              </p>
              <p className="text-sm text-gray-600">Status: {appraisal.status}</p>
              <p className="text-sm text-gray-600">
                Created: {new Date(appraisal.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <Link to={`/appraisals/${appraisal._id}`}>
                <Button variant="secondary">View Details</Button>
              </Link>
              {onAction && (
                <Button onClick={() => onAction(appraisal._id, 'action')}>
                  Take Action
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
