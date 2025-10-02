export interface ReportOut {
  id: string;
  filename: string;
  pages: number;
  text_len: number;
}

export async function uploadPdf(file: File, clientId: string, bureau: string): Promise<ReportOut> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_id', clientId);
  formData.append('user_id', clientId); // legacy name used by some endpoints
  formData.append('bureau', bureau);

  let response: Response;
  try {
    response = await fetch('/api/reports/upload', {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Unable to reach the Next.js API route. Ensure the frontend dev server is running.'
      );
    }

    throw new Error(
      error instanceof Error ? error.message : 'Unexpected network error while uploading the report.'
    );
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let errorMessage = `Upload failed with status ${response.status}`;

    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        const detail = errorData?.detail ?? errorData?.message ?? errorData?.error;
        if (typeof detail === 'string' && detail.trim()) {
          errorMessage = detail;
        }
      } catch (error) {
        console.error('Failed to parse error response as JSON:', error);
      }
    } else {
      try {
        const text = await response.text();
        if (text.trim()) {
          errorMessage = text;
        }
      } catch (error) {
        console.error('Failed to read error response text:', error);
      }
    }

    throw new Error(errorMessage);
  }

  try {
    const data = (await response.json()) as ReportOut;
    return data;
  } catch (error) {
    throw new Error('Failed to parse upload response.');
  }
}
