import { CONFIG } from '../config';

export interface UploadResult {
  id: string;
  report_id?: string;
  filename: string;
  pages: number;
  text_len: number;
  created_at: string;
}

export async function uploadPdf(file: File, clientId?: string, bureau?: string): Promise<UploadResult> {
  if (!file) {
    throw new Error('A PDF file is required for upload.');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (clientId) {
    formData.append('client_id', clientId);
  }
  if (bureau) {
    formData.append('bureau', bureau);
  }

  const response = await fetch(`${CONFIG.API_URL}/reports/upload`, {
    method: 'POST',
    body: formData,
  }).catch(() => {
    throw new Error(`Unable to reach API at ${CONFIG.API_URL}`);
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    if (response.status === 413) {
      throw new Error('File too large (limit 10MB).');
    }
    if (response.status === 415) {
      throw new Error('Unsupported file type. Please upload a PDF.');
    }
    throw new Error(message || `Upload failed with status ${response.status}.`);
  }

  return response.json();
}
