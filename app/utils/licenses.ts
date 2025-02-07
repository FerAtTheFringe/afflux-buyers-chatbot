export async function fetchLicenses(params) {
  try {
    const queryParams = new URLSearchParams();

    const optionalParams = [
      "q",
      "afterdate",
      "beforedate",
      "district",
      "m30",
      "municipality",
      "neighborhood",
      "operation",
      "promotor",
      "residentialtypology",
    ];

    console.log("PARAMS", params);

    optionalParams.forEach((param) => {
      const values = params[param];
      if (values) {
        if (Array.isArray(values)) {
          values.forEach((value) => queryParams.append(param, value));
        } else {
          queryParams.append(param, values);
        }
      }
    });

    const queryString = queryParams.toString();
    const url = `/api/licenses${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para licencias");
    }

    const json = await response.json();
    console.log("Licencias", json.data);
    // SLICED to avoid large responses error
    return json.data;
  } catch (error) {
    console.error("Error en fetchLicenses:", error);
    throw error;
  }
}
