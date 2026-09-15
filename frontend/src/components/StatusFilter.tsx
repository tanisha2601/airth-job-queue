import React from 'react';
import type {  JobStatus  } from '../types/job';

interface StatusFilterProps {
  selectedFilter: JobStatus | 'all';
  onFilterChange: (filter: JobStatus | 'all') => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedFilter, onFilterChange }) => {
  const filters: (JobStatus | 'all')[] = ['all', 'pending', 'running', 'completed', 'failed'];

  return (
    <div className="status-filter">
      {filters.map(filter => (
        <button
          key={filter}
          className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};
