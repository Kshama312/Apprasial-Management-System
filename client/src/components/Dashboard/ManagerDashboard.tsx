import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../Shared/Card';
import { Button } from '../Shared/Button';
import { Appraisal, AppraisalStatus } from '../../types';
import api from '../../utils/api';

export const ManagerDashboard: React.FC = () => {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const response = await api.get('/appraisals'); // Changed endpoint
        console.log("Fetched appraisals:", response.data); 
        setAppraisals(response.data);
      } catch (error) {
        console.error('Error fetching appraisals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppraisals();
  }, []);

  const handleManagerAction = async (id: string, action: 'approve' | 'forward') => {
    try {
      if (action === 'approve') {
        await api.put(`/appraisals/${id}/approve`);
      } else {
        await api.put(`/appraisals/${id}/manager`);
      }
      setAppraisals(appraisals.filter((appraisal) => appraisal._id !== id));
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Manager Dashboard</h2>
        <p className="text-gray-600">
          Review and manage appraisals that require your attention.
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Pending Appraisals</h3>
        {appraisals.length === 0 ? (
          <p className="text-gray-600">No pending appraisals.</p>
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
                  {appraisal.status === AppraisalStatus.PENDING_MANAGER && (
                    <Button
                      onClick={() => handleManagerAction(appraisal._id, 'forward')}
                    >
                      Forward to Supervisor
                    </Button>
                  )}
                  {appraisal.status === AppraisalStatus.PENDING_FEEDBACK && (
                    <Button
                      onClick={() => handleManagerAction(appraisal._id, 'approve')}
                    >
                      Final Approval
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
