import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../Shared/Card';
import { Button } from '../Shared/Button';
import { Appraisal } from '../../types';
import api from '../../utils/api';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 bg-gray-50">
      <Card className="shadow-xl border border-gray-200 rounded-xl p-6 bg-white">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Create a new self-appraisal or view your existing ones.
        </p>
        <Link to="/appraisals/create">
          <Button className="w-full sm:w-auto" variant="primary">
            Create New Appraisal
          </Button>
        </Link>
      </Card>

      <Card className="shadow-xl border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Appraisals</h3>
        {appraisals.length === 0 ? (
          <p className="text-gray-600">No appraisals found.</p>
        ) : (
          <div className="space-y-4">
            {appraisals.map((appraisal) => (
              <div
                key={appraisal._id}
                className="flex justify-between items-center border-b border-gray-200 py-4"
              >
                <div>
                  <p className="font-medium text-lg text-gray-800">
                    Appraisal ID: {appraisal._id.substring(0, 8)}
                  </p>
                  <p className="text-sm text-gray-600">Status: {appraisal.status}</p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(appraisal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/appraisals/${appraisal._id}`}>
                  <Button variant="secondary" className="text-blue-600 hover:bg-blue-100 transition-colors">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
