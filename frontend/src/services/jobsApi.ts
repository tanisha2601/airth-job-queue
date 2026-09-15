import type { Job, CreateJobPayload, JobStatus } from '../types/job';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'An unexpected error occurred';
    try {
      const errorData = await res.json();
      message = errorData.message || message;
      if (Array.isArray(message)) {
        message = message.join(', ');
      }
    } catch {
      // Body might not be JSON or might be empty
    }
    throw new ApiError(res.status, message);
  }
  
  if (res.status === 204) {
    return {} as T;
  }
  
  return res.json();
}

export const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    const res = await fetch(`${API_BASE}/jobs`);
    return handleResponse<Job[]>(res);
  },

  createJob: async (payload: CreateJobPayload): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<Job>(res);
  },

  updateJobStatus: async (id: string, status: JobStatus): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Job>(res);
  },

  deleteJob: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  }
};
