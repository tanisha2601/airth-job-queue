import React from 'react';
import type {  Job  } from '../types/job';

interface SummaryCardsProps {
  jobs: Job[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ jobs }) => {
  const counts = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  return (
    <div className="summary-cards">
      <div className="card total">
        <div className="card-label">All Jobs</div>
        <div className="card-value">{counts.total}</div>
      </div>
      <div className="card pending">
        <div className="card-label">Pending</div>
        <div className="card-value">{counts.pending}</div>
      </div>
      <div className="card running">
        <div className="card-label">Running</div>
        <div className="card-value">{counts.running}</div>
      </div>
      <div className="card completed">
        <div className="card-label">Completed</div>
        <div className="card-value">{counts.completed}</div>
      </div>
      <div className="card failed">
        <div className="card-label">Failed</div>
        <div className="card-value">{counts.failed}</div>
      </div>
    </div>
  );
};
