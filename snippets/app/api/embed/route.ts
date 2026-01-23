import { NextRequest, NextResponse } from 'next/server';
import { calculateIframeHeight } from '@/app/_utils/iframeHeight';

/**
 * API route that generates embed code for code snippets.
 * 
 * Accepts:
 * - code (required): The code to embed
 * - language (optional, default: 'javascript'): Programming language
 * - theme (optional, default: 'light'): 'light' or 'dark'
 * - width (optional, default: '100%'): Iframe width
 * - height (optional): Iframe height (auto-calculated if not provided)
 * - baseUrl (optional): Base URL for the snippet (defaults to request origin)
 * 
 * Returns:
 * - embedCode: The iframe HTML code
 * - url: The snippet URL
 * - height: The calculated iframe height
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language = 'javascript', theme = 'light', width = '100%', height, baseUrl } = body;

    // Validate required fields
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate language
    if (typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Language must be a string' },
        { status: 400 }
      );
    }

    // Validate theme
    if (theme !== 'light' && theme !== 'dark') {
      return NextResponse.json(
        { error: 'Theme must be "light" or "dark"' },
        { status: 400 }
      );
    }

    // Encode code as base64
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    // Get base URL
    const origin = baseUrl || request.headers.get('origin') || request.nextUrl.origin;
    const snippetUrl = `${origin}/s/${language}/${urlEncoded}`;

    // Calculate height if not provided
    const iframeHeight = height || `${calculateIframeHeight(code)}px`;

    // Build embed URL with query parameters
    const embedUrl = new URL(snippetUrl);
    embedUrl.searchParams.set('embed', 'true');
    embedUrl.searchParams.set('theme', theme);

    // Generate iframe HTML code
    const embedCode = `<iframe src="${embedUrl.toString()}" width="${width}" height="${iframeHeight}" frameborder="0" allowfullscreen></iframe>`;

    return NextResponse.json({
      embedCode,
      url: embedUrl.toString(),
      height: iframeHeight,
      width,
      language,
      theme,
    });
  } catch (error) {
    console.error('Error generating embed code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for convenience (accepts query parameters)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const language = searchParams.get('language') || 'javascript';
    const theme = searchParams.get('theme') || 'light';
    const width = searchParams.get('width') || '100%';
    const height = searchParams.get('height');
    const baseUrl = searchParams.get('baseUrl');

    // Validate required fields
    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter is required' },
        { status: 400 }
      );
    }

    // Validate theme
    if (theme !== 'light' && theme !== 'dark') {
      return NextResponse.json(
        { error: 'Theme must be "light" or "dark"' },
        { status: 400 }
      );
    }

    // Encode code as base64
    const base64Encoded = Buffer.from(code).toString('base64');
    const urlEncoded = encodeURIComponent(base64Encoded);

    // Get base URL
    const origin = baseUrl || request.headers.get('origin') || request.nextUrl.origin;
    const snippetUrl = `${origin}/s/${language}/${urlEncoded}`;

    // Calculate height if not provided
    const iframeHeight = height || `${calculateIframeHeight(code)}px`;

    // Build embed URL with query parameters
    const embedUrl = new URL(snippetUrl);
    embedUrl.searchParams.set('embed', 'true');
    embedUrl.searchParams.set('theme', theme);

    // Generate iframe HTML code
    const embedCode = `<iframe src="${embedUrl.toString()}" width="${width}" height="${iframeHeight}" frameborder="0" allowfullscreen></iframe>`;

    return NextResponse.json({
      embedCode,
      url: embedUrl.toString(),
      height: iframeHeight,
      width,
      language,
      theme,
    });
  } catch (error) {
    console.error('Error generating embed code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
