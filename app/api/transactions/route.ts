import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams();

    const optionalParams = [
      "q",
      "afterdate",
      "assettype",
      "beforedate",
      "buyer",
      "district",
      "m30",
      "municipality",
      "neighborhood",
      "seller",
      "transactiontype",
    ];

    optionalParams.forEach((param) => {
      const values = searchParams.getAll(param);
      values.forEach((value) => {
        if (value) {
          params.append(param, value);
        }
      });
    });

    const queryString = params.toString();
    const url = `https://api.tinybird.co/v0/pipes/api_afflux_transacciones_v1.json${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

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
