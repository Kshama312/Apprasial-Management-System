import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Shared/Button';
import { Card } from '../Shared/Card';
import api from '../../utils/api';
import { toast } from 'react-toastify'; // ✅ Import toast

export const FeedbackForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post(`/appraisals/${id}/feedback`, { comment, rating });
      
      // ✅ Show toast on success
      toast.success('Feedback submitted successfully!');

      // Navigate after a short delay to give time for the toast to show
      setTimeout(() => navigate(`/appraisals/${id}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} - {value === 1 ? 'Poor' : value === 3 ? 'Average' : value === 5 ? 'Excellent' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide your feedback here..."
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/appraisals/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
           Submit Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
};
