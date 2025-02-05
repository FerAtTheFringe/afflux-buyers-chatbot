import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.tinybird.co/v0/pipes/api_afflux_licencias_v1.json",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
          "Accept-Encoding": "gzip, deflate, br",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en la API de Tinybird:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
