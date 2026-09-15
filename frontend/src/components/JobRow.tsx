import React, { useState } from 'react';
import type {  Job, JobStatus  } from '../types/job';
import { StatusBadge } from './StatusBadge';

interface JobRowProps {
  job: Job;
  onStatusChange: (id: string, newStatus: JobStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const JobRow: React.FC<JobRowProps> = ({ job, onStatusChange, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: JobStatus) => {
    setLoading(true);
    await onStatusChange(job.id, status);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setLoading(true);
      await onDelete(job.id);
      setLoading(false);
    }
  };

  const formattedDate = new Date(job.createdAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr className={loading ? 'row-loading' : ''}>
      <td className="col-title" title={job.title}>{job.title}</td>
      <td className="col-type">{job.type}</td>
      <td className="col-status">
        <StatusBadge status={job.status} />
      </td>
      <td className="col-date">{formattedDate}</td>
      <td className="col-actions">
        <div className="action-buttons">
          {job.status === 'pending' && (
            <button className="btn btn-sm btn-start" onClick={() => handleStatusChange('running')} disabled={loading}>
              Start
            </button>
          )}
          {job.status === 'running' && (
            <>
              <button className="btn btn-sm btn-complete" onClick={() => handleStatusChange('completed')} disabled={loading}>
                Complete
              </button>
              <button className="btn btn-sm btn-fail" onClick={() => handleStatusChange('failed')} disabled={loading}>
                Fail
              </button>
            </>
          )}
          <button className="btn btn-sm btn-delete" onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
