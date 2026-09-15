import React from 'react';

interface HeaderProps {
  onCreateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateClick }) => {
  return (
    <header className="header">
      <div className="header-title">
        <h1>Job Queue Dashboard</h1>
        <p>Manage and monitor queued background jobs seamlessly</p>
      </div>
      <button className="btn btn-primary" onClick={onCreateClick}>
        <span className="plus-icon">+</span> Create Job
      </button>
    </header>
  );
};
