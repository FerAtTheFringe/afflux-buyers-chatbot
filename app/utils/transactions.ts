export async function fetchTransactions(params) {
  try {
    const queryParams = new URLSearchParams();

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
      "minimumvalue",
      "maximumvalue"
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
    const url = `/api/transactions${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para transacciones");
    }

    const json = await response.json();
    console.log("TRANSACTIONS", json.data);

    return json.data;
  } catch (error) {
    console.error("Error en fetchTransactions:", error);
    throw error;
  }
}
