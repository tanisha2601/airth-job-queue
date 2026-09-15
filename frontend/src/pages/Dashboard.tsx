import React, { useState, useEffect, useMemo } from 'react';
import { jobsApi, ApiError } from '../services/jobsApi';
import type {  Job, JobStatus, CreateJobPayload  } from '../types/job';
import { Header } from '../components/Header';
import { SummaryCards } from '../components/SummaryCards';
import { StatusFilter } from '../components/StatusFilter';
import { JobTable } from '../components/JobTable';
import { CreateJobModal } from '../components/CreateJobModal';

export const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobsApi.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateJob = async (payload: CreateJobPayload) => {
    await jobsApi.createJob(payload);
    setIsCreateModalOpen(false);
    showNotification('Job created successfully.', 'success');
    await fetchJobs();
  };

  const handleStatusChange = async (id: string, status: JobStatus) => {
    try {
      await jobsApi.updateJobStatus(id, status);
      await fetchJobs(); // Refresh to ensure synchronization
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          showNotification('This job was changed by another action. The latest job status has been loaded.', 'error');
        } else if (err.status === 404) {
          showNotification('Job not found. The list has been refreshed.', 'error');
        } else if (err.status === 400) {
          showNotification('Invalid request. Please check the job details.', 'error');
        } else {
          showNotification('Something went wrong. Please try again.', 'error');
        }
      } else {
        showNotification('Network error occurred.', 'error');
      }
      await fetchJobs(); // Always refetch on conflict or not found
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.deleteJob(id);
      showNotification('Job deleted successfully.', 'success');
      await fetchJobs();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) {
        showNotification('Job not found. The list has been refreshed.', 'error');
      } else {
        showNotification('Failed to delete job. Please try again.', 'error');
      }
      await fetchJobs();
    }
  };

  const filteredJobs = useMemo(() => filter === 'all' ? jobs : jobs.filter(j => j.status === filter), [filter, jobs]);

  return (
    <div className="dashboard">
      <Header onCreateClick={() => setIsCreateModalOpen(true)} />
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="main-content">
        {error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchJobs}>Retry</button>
          </div>
        ) : (
          <>
            <SummaryCards jobs={jobs} />
            
            <div className="controls">
              <StatusFilter selectedFilter={filter} onFilterChange={setFilter} />
              <button className="btn btn-secondary refresh-btn" onClick={fetchJobs} disabled={loading}>
                {loading ? 'Refreshing...' : '↻ Refresh'}
              </button>
            </div>
            
            <JobTable
              jobs={filteredJobs}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              loading={loading}
            />
          </>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateJobModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateJob}
        />
      )}
    </div>
  );
};
