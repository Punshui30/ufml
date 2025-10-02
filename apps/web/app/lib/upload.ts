import { CONFIG } from '../config';

interface UploadOptions {
  eOscarBypassEnabled?: boolean;
  reportDate?: string;
}

function buildErrorMessage(status: number, fallback: string, body: string): string {
  if (status === 413) return 'File too large (limit 10MB).';
  if (status === 415) return 'Unsupported file type. Please upload a PDF.';
  if (status >= 500) return `Server error (${status}). ${body || fallback}`;
  return `Request failed (${status}). ${body || fallback}`;
}

export async function uploadPdf(
  file: File,
  clientId: string,
  bureau: string,
  options: UploadOptions = {}
) {
  if (!file) throw new Error('No file provided.');
  if (!clientId) throw new Error('A client must be selected before uploading.');
  if (!bureau) throw new Error('A credit bureau must be selected before uploading.');

  if (CONFIG.USE_MOCKS) {
    throw new Error('File uploads are disabled while mock data mode is active.');
  }

  const url = new URL(`${CONFIG.API_URL}/reports/upload`);
  url.searchParams.set('user_id', clientId);
  url.searchParams.set('bureau', bureau);
  if (options.reportDate) {
    url.searchParams.set('report_date', options.reportDate);
  }
  if (typeof options.eOscarBypassEnabled === 'boolean') {
    url.searchParams.set('e_oscar_bypass', String(options.eOscarBypassEnabled));
  }

  const formData = new FormData();
  formData.append('file', file, file.name);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    throw new Error(`Network error: cannot reach API at ${CONFIG.API_URL}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(buildErrorMessage(response.status, 'Upload failed.', body));
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error('Upload succeeded but the server returned an unexpected response.');
  }
}
