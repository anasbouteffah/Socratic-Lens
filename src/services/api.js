/**
 * API Service for Socratic Lens Backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Analyze a homework image using the Vision API
 * @param {File|Blob} imageFile - The image file to analyze
 * @returns {Promise<{extracted_text: string, problem_type: string, subject: string, difficulty: string, key_concepts: string[]}>}
 */
export async function analyzeImage(imageFile) {
  const formData = new FormData();
  // Add filename to the blob for proper multipart handling
  formData.append('file', imageFile, 'homework.jpg');

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend. Make sure the server is running on http://localhost:8000');
    }
    throw error;
  }
}

/**
 * Get a Socratic hint for the problem
 * @param {Object} params
 * @param {string} params.problemText - The extracted problem text
 * @param {string} params.problemType - Type of problem
 * @param {string} params.subject - Subject area
 * @param {string} [params.userQuestion] - Optional user question
 * @param {string[]} [params.previousHints] - Previous hints given
 * @returns {Promise<{hint: string, hint_type: string, follow_up: string|null}>}
 */
export async function getSocraticHint({ problemText, problemType, subject, userQuestion, previousHints }) {
  const params = new URLSearchParams({
    problem_text: problemText,
    problem_type: problemType,
    subject: subject,
  });

  if (userQuestion) {
    params.append('user_question', userQuestion);
  }

  if (previousHints && previousHints.length > 0) {
    previousHints.forEach(hint => params.append('previous_hints', hint));
  }

  const response = await fetch(`${API_BASE_URL}/hint?${params.toString()}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get hint');
  }

  return response.json();
}

/**
 * Convert a base64 data URL to a Blob
 * @param {string} dataUrl - The data URL (e.g., from canvas.toDataURL())
 * @returns {Blob}
 */
export function dataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Check if the backend is online
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    return data.status === 'online';
  } catch {
    return false;
  }
}
