export async function fetchWebSearch(params) {
  try {
    const queryParams = new URLSearchParams();

    if (params.query) {
      queryParams.append("query", params.query);
    }

    console.log("QUERY", params.query);
    
    const queryString = queryParams.toString();
    const url = `/api/websearch${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: params.query }),
    });
    
    if (!response.ok) {
        throw new Error("Error al obtener resultados de búsqueda");
    }
    
    const json = await response.json();
    console.log("JSON", json);
    return json.results;
  } catch (error) {
    console.error("Error en fetchWebSearch:", error);
    throw error;
  }
}
