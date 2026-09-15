export const API_BASE_URL = 'http://localhost:3000';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
