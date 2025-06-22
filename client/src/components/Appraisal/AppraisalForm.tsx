import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Shared/Button';
import { Card } from '../Shared/Card';
import api from '../../utils/api';

export const AppraisalForm: React.FC = () => {
  const [selfReview, setSelfReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/appraisals', { selfReview, status: 'PendingManager', });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating appraisal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Self-Appraisal</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Self Review
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={10}
            value={selfReview}
            onChange={(e) => setSelfReview(e.target.value)}
            placeholder="Write your self-assessment here..."
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Submit Appraisal
          </Button>
        </div>
      </form>
    </Card>
  );
};
