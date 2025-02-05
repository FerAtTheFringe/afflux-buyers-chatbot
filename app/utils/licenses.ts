export async function fetchLicenses() {
  try {
    const response = await fetch("/api/licenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para licencias");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error en fetchLicenses:", error);
    throw error;
  }
}
