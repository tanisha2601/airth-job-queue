import React from 'react';
import type {  JobStatus  } from '../types/job';

interface StatusBadgeProps {
  status: JobStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`status-badge ${status}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
};
