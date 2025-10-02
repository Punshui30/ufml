import { NextResponse } from 'next/server';
import { CONFIG } from '@/app/config';

const UPSTREAM_PATH = '/reports/upload';

function toErrorResponse(message: string, status: number) {
  return NextResponse.json({ detail: message }, { status });
}

export async function POST(request: Request) {
  if (CONFIG.USE_MOCKS) {
    return toErrorResponse('Report uploads are disabled while mocks are enabled.', 503);
  }

  let incomingForm: FormData;
  try {
    incomingForm = await request.formData();
  } catch (error) {
    console.error('Failed to read incoming upload form data:', error);
    return toErrorResponse('Invalid upload payload.', 400);
  }

  const file = incomingForm.get('file');
  if (!(file instanceof File)) {
    return toErrorResponse('A PDF file is required for upload.', 400);
  }

  const clientIdEntry = incomingForm.get('client_id') ?? incomingForm.get('user_id');
  const bureauEntry = incomingForm.get('bureau');

  if (typeof clientIdEntry !== 'string' || clientIdEntry.trim() === '') {
    return toErrorResponse('A client identifier must be provided.', 400);
  }

  if (typeof bureauEntry !== 'string' || bureauEntry.trim() === '') {
    return toErrorResponse('A credit bureau selection is required.', 400);
  }

  const outboundForm = new FormData();
  for (const [key, value] of incomingForm.entries()) {
    if (key === 'file') {
      continue;
    }

    if (typeof value === 'string') {
      outboundForm.append(key, value);
    }
  }

  outboundForm.set('client_id', clientIdEntry);
  outboundForm.set('user_id', clientIdEntry);
  outboundForm.set('bureau', bureauEntry);
  outboundForm.set('file', file);

  const upstreamUrl = `${CONFIG.API_URL}${UPSTREAM_PATH}`;

  let upstreamResponse: Response;
  try {
    const headers = new Headers();
    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers.set('authorization', authorization);
    }

    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers.set('cookie', cookie);
    }

    upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      body: outboundForm,
      headers
    });
  } catch (error) {
    console.error('Failed to reach upstream reports service:', error);
    return toErrorResponse(
      `Unable to reach the reports service at ${upstreamUrl}. Ensure the backend is running and accessible.`,
      502
    );
  }

  const responseHeaders = new Headers();
  const contentType = upstreamResponse.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }

  const body = await upstreamResponse.arrayBuffer();

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers: responseHeaders
  });
}
