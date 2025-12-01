import { NextRequest, NextResponse } from 'next/server';

// Hardcoded backend URL for Docker environment
const BACKEND_URL = 'http://backend:8000';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathString = path.join('/');
  const url = `${BACKEND_URL}/api/${pathString}`;

  console.log(`Proxying request to: ${url}`);

  try {
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : null;

    const res = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: body,
      // @ts-ignore
      duplex: 'half',
    });

    const data = await res.blob();

    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
