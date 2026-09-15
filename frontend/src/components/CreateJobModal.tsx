import React, { useState } from 'react';
import type {  CreateJobPayload  } from '../types/job';

interface CreateJobModalProps {
  onClose: () => void;
  onSubmit: (payload: CreateJobPayload) => Promise<void>;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type.trim()) {
      setError('Title and Type are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim(), type: type.trim() });
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Create New Job</h2>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Generate monthly report"
              maxLength={200}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Job Type</label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. report"
              maxLength={100}
              disabled={loading}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
