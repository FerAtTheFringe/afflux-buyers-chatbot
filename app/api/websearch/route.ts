import { NextResponse } from "next/server";

const SEARCH_API_URL = "https://www.googleapis.com/customsearch/v1";
const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const CX = process.env.GOOGLE_SEARCH_CX;

export async function POST(req) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const url = `${SEARCH_API_URL}?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data.items });
  } catch (error) {
    console.error("Web search error:", error);
    return NextResponse.json(
      { error: "Failed to perform web search" },
      { status: 500 }
    );
  }
}
