import React from 'react';
import type {  Job, JobStatus  } from '../types/job';
import { JobRow } from './JobRow';

interface JobTableProps {
  jobs: Job[];
  onStatusChange: (id: string, newStatus: JobStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export const JobTable: React.FC<JobTableProps> = ({ jobs, onStatusChange, onDelete, loading }) => {
  if (loading && jobs.length === 0) {
    return (
      <div className="table-container empty-state">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="table-container empty-state">
        <div className="empty-icon">📂</div>
        <p>No jobs found.</p>
        <p className="empty-subtext">There are currently no jobs matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="job-table">
        <thead>
          <tr>
            <th className="col-title">Title</th>
            <th className="col-type">Type</th>
            <th className="col-status">Status</th>
            <th className="col-date">Created At</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <JobRow
              key={job.id}
              job={job}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
