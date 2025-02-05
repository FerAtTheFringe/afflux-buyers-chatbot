export async function humanQueryToSQL({ humanQuery }: { humanQuery: string }) {
  const systemMessage = `
    Given the following schema, write a SQL query that retrieves the requested information. Select relevant columns **only**. Ensure that column names are **used exactly** as defined in the schema, without modifications or assumptions. Avoid adding a ";" to the end of the SQL query. Current year is 2025.
    If the user requests information about buildings without specifying a specific type of building, do not apply a filter on "asset_type".
    Return the SQL query inside a JSON structure with the key "sql_query".
    <schema>
TABLE < afflux_transacciones_mv > ENGINE = MergeTree
SCHEMA >
    "CCAA" Nullable(String),
    "provincia" Nullable(String),
    "municipio" Nullable(String),
    "distrito" Nullable(String),
    "barrio" Nullable(String),
    "TRANSACCIONES.id_transaccion" String,
    "TRANSACCIONES.source_date" String,
    "TRANSACCIONES.source_offmarket_reg_news" String,
    "TRANSACCIONES.aura_transaction_id" Nullable(String),
    "TRANSACCIONES.portfolio_id" Nullable(String),
    "TRANSACCIONES.duplicate_id" Nullable(String),
    "TRANSACCIONES.original_source_link" Nullable(String),
    "TRANSACCIONES.brainsre_news_en" Nullable(String),
    "TRANSACCIONES.brainsre_news_es" Nullable(String),
    "TRANSACCIONES.brainsre_news_po" Nullable(String),
    "TRANSACCIONES.brainsre_news_it" Nullable(String),
    "TRANSACCIONES.brainsre_news_gr" Nullable(String),
    "TRANSACCIONES.brainsre_news_sa" Nullable(String),
    "TRANSACCIONES.date_daily" String,
    "TRANSACCIONES.month" String,
    "TRANSACCIONES.quarter" String,
    "TRANSACCIONES.year" Int32,
    "TRANSACCIONES.transaction_type" String,
    "TRANSACCIONES.property_description" String,
    "TRANSACCIONES.asset_type" Nullable(String),
    "TRANSACCIONES.id_seller" Nullable(String),
    "TRANSACCIONES.id_buyer" Nullable(String),
    "TRANSACCIONES.seller" Nullable(String),
    "TRANSACCIONES.buyer" Nullable(String),
    "TRANSACCIONES.id_multiple_seller" Nullable(String),
    "TRANSACCIONES.id_multiple_buyer" Nullable(String),
    "TRANSACCIONES.tenant" Nullable(String),
    "TRANSACCIONES.source_value" Nullable(String),
    "TRANSACCIONES.final_value" Nullable(String),
    "TRANSACCIONES.value_type" Nullable(String),
    "TRANSACCIONES.total_portfolio_value" Nullable(String),
    "TRANSACCIONES.rent" Nullable(String),
    "TRANSACCIONES.country" String,
    "TRANSACCIONES.province" String,
    "TRANSACCIONES.municipality" String,
    "TRANSACCIONES.address" Nullable(String),
    "TRANSACCIONES.exact_location" String,
    "TRANSACCIONES.cad_reference" Nullable(String),
    "TRANSACCIONES.units_flats_rooms_beds" Nullable(Int32),
    "TRANSACCIONES.built_buildable_sqm" Nullable(String),
    "TRANSACCIONES.land_sqm" Nullable(String),
    "TRANSACCIONES.advisor_1" Nullable(String),
    "TRANSACCIONES.advisor_2" Nullable(String),
    "TRANSACCIONES.advisor_3" Nullable(String),
    "TRANSACCIONES.advisor_4" Nullable(String),
    "TRANSACCIONES.advisor_5" Nullable(String),
    "TRANSACCIONES.comment" Nullable(String),
    "AUX.m30" Int16,
    "AUX.lat" Nullable(Float32),
    "AUX.lon" Nullable(Float32)


ENGINE_SORTING_KEY "TRANSACCIONES.id_transaccion, TRANSACCIONES.transaction_type, TRANSACCIONES.date_daily, AUX.m30"
    </schema>
    <values>
    "TRANSACCIONES.transaction_type" possible values:
      - "1. Sale"
      - "2. Negotiation"
      - "8. Sale&Leaseback"
      - "11. Build to Rent"
      - "12. Auction"
      - "13. Turn key project"
      - "14. Expropriation"

    "TRANSACCIONES.asset_type" possible values:
      - "Residential"
      - "Urban/Developer Plots"
      - "Office"
      - "Other"
      - "Shopping Centre"
      - "Retail"
      - "Hotel"
      - "Portfolio"
      - "Seniors Housing & Care"
      - "Parking"
      - "Logistic"
      - "Student residence"
      - NULL (Puede contener valores nulos)
    </values>
    `;

  const userMessage = humanQuery;
  const body = JSON.stringify({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  try {
    const response = await fetch("/api/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en la solicitud");
    }
    const json = await response.json();
    const assistantResponse = json.choices[0].message.content;
    console.log(JSON.parse(assistantResponse).sql_query);

    return JSON.parse(assistantResponse).sql_query;
  } catch (error) {
    console.error("Error al llamar a la API de chat:", error);
    return { error: error.message };
  }
}
