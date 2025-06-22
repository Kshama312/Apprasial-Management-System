// src/components/Dashboard/SupervisorDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../Shared/Card';
import { Button } from '../Shared/Button';
import { Appraisal, AppraisalStatus } from '../../types';
import api from '../../utils/api';

export const SupervisorDashboard: React.FC = () => {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const response = await api.get('/appraisals');
        setAppraisals(response.data);
      } catch (error) {
        console.error('Error fetching appraisals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppraisals();
  }, []);

  const handleSendForFeedback = async (id: string) => {
    try {
      await api.put(`/appraisals/${id}/supervisor`);
      setAppraisals(
        appraisals.map((appraisal) =>
          appraisal._id === id
            ? { ...appraisal, status: AppraisalStatus.PENDING_FEEDBACK }
            : appraisal
        )
      );
    } catch (error) {
      console.error('Error sending for feedback:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Supervisor Dashboard</h2>
        <p className="text-gray-600">
          Review appraisals and manage feedback collection process.
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Appraisals to Review</h3>
        {appraisals.length === 0 ? (
          <p className="text-gray-600">No appraisals to review at this time.</p>
        ) : (
          <div className="space-y-4">
            {appraisals.map((appraisal) => (
              <div
                key={appraisal._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Employee ID: {appraisal.employeeId.name}</p>
                  <p className="text-sm text-gray-600">Status: {appraisal.status}</p>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(appraisal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link to={`/appraisals/${appraisal._id}`}>
                    <Button variant="secondary">View Details</Button>
                  </Link>
                  {appraisal.status === AppraisalStatus.PENDING_SUPERVISOR && (
                    <Button
                      onClick={() => handleSendForFeedback(appraisal._id)}
                    >
                      Send for Feedback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};