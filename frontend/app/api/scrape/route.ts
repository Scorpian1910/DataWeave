import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, selectors } = body;

    const response = await fetch("http://localhost:5000/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, selectors }),
    });

    if (!response.ok) {
      throw new Error('Failed to scrape data');
    }

    const scrapedData = await response.json();

    return NextResponse.json(scrapedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scrape data" },
      { status: 500 }
    );
  }
}
