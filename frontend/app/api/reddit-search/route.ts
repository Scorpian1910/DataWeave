import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    // For demonstration, return mock data
    // In a real implementation, this would call your Python backend
    const mockRedditResults = [
      {
        title: "Sample Reddit Post 1",
        content: "This is a sample Reddit post about " + query,
        url: "https://reddit.com/r/sample/1"
      },
      {
        title: "Sample Reddit Post 2",
        content: "Another relevant Reddit post about " + query,
        url: "https://reddit.com/r/sample/2"
      }
    ];

    return NextResponse.json(mockRedditResults);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search Reddit" },
      { status: 500 }
    );
  }
}