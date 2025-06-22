import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../Shared/Card';
import { Button } from '../Shared/Button';
import { Appraisal, Role } from '../../types';
import api from '../../utils/api';

export const AppraisalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appraisal, setAppraisal] = useState<Appraisal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppraisal = async () => {
      try {
        const response = await api.get(`/appraisals/${id}`);
        setAppraisal(response.data);
      } catch (err) {
        setError('Error fetching appraisal details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppraisal();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!appraisal) return <div>Appraisal not found</div>;

  const canGiveFeedback = 
    (user?.role === Role.PEER || user?.role === Role.JUNIOR) &&
    appraisal.status === 'PendingFeedback';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Appraisal Details</h2>
            <p className="text-gray-600">ID: {appraisal._id}</p>
            <p className="text-gray-600">Status: {appraisal.status}</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Self Review</h3>
        <p className="whitespace-pre-wrap">{appraisal.selfReview}</p>
      </Card>

      {appraisal.peerFeedbacks.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Peer Feedback</h3>
          <div className="space-y-4">
            {appraisal.peerFeedbacks.map((feedback, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Peer Review #{index + 1}</p>
                  <p className="text-sm text-gray-600">
                    Rating: {feedback.rating}/5
                  </p>
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {appraisal.juniorFeedbacks.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Junior Feedback</h3>
          <div className="space-y-4">
            {appraisal.juniorFeedbacks.map((feedback, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Junior Review #{index + 1}</p>
                  <p className="text-sm text-gray-600">
                    Rating: {feedback.rating}/5
                  </p>
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {canGiveFeedback && (
        <div className="flex justify-end">
          <Button onClick={() => navigate(`/appraisals/${id}/feedback`)}>
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  );
};
