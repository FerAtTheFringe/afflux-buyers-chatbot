import React, { useState } from "react";
import styles from "./licenses-widget.module.css";

const formatStringPrice = (value: string) => {
  if (!value) return "N/A";
  const numberValue = parseFloat(value);
  return isNaN(numberValue) ? value : numberValue.toLocaleString("es-ES");
};

const LicensesWidget = ({ licenses = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJson, setViewJson] = useState(false);
  const show = licenses.length > 0;

  const filteredLicenses = licenses.filter((transaction) =>
    (transaction["LICENCIAS.obra"]?.toLowerCase() ?? "").includes(
      searchQuery.toLowerCase()
    )
  );

  const downloadCSV = () => {
    const csvContent = [
      [
        "Fecha",
        "Link",
        "Tipo de transacción",
        "Tipo de propiedad",
        "Descripción",
        "Comprador",
        "Vendedor",
        "Ciudad",
        "Dirección",
        "M30",
        "Precio Final",
      ],
      ...licenses.map((transaction) => [
        transaction["TRANSACCIONES.source_date"],
        transaction["TRANSACCIONES.brainsre_news_es"],
        transaction["TRANSACCIONES.transaction_type"],
        transaction["TRANSACCIONES.asset_type"],
        transaction["TRANSACCIONES.property_description"],
        transaction["TRANSACCIONES.buyer"],
        transaction["TRANSACCIONES.seller"],
        transaction["TRANSACCIONES.municipality"],
        transaction["TRANSACCIONES.address"],
        transaction["AUX.m30"] ? "Sí" : "No",
        transaction["TRANSACCIONES.final_value"],
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`${styles.companyWidget} ${
        show ? styles.fadeIn : styles.fadeOut
      }`}
    >
      <div className={styles.columnTitle}>
        <h1>Licencias</h1>
        <small>{filteredLicenses.length} resultados</small>
      </div>

      <div className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type="text"
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por obra"
        />
        <div className={styles.chatControls}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setViewJson(!viewJson)}
          >
            {viewJson ? "Ver Tarjetas" : "Ver JSON"}
          </button>
          <button type="button" className={styles.button} onClick={downloadCSV}>
            Descargar CSV
          </button>
        </div>
      </div>
      {viewJson ? (
        <pre className={styles.jsonView}>
          {JSON.stringify(filteredLicenses, null, 2)}
        </pre>
      ) : (
        <div className={styles.companyDetails}>
          {filteredLicenses.map((license, index) => (
            <div key={index} className={styles.companyCard}>
              <div className={styles.companyCardHeader}>
                <h2>{license["LICENCIAS.developer"] || "N/A"}</h2>
                <h4>
                  Presupuesto: €{formatStringPrice(license["LICENCIAS.budget"])}
                </h4>
                <h5>
                  Desde {license["LICENCIAS.fecha_inicio"] || "N/A"} hasta{" "}
                  {license["LICENCIAS.fecha_fin"] || "N/A"}
                </h5>
              </div>

              <p>
                <strong>Tipología Residencial:</strong>{" "}
                {license["LICENCIAS.residential_typology"] || "N/A"}
              </p>
              <p>
                <strong>Obra:</strong> {license["LICENCIAS.obra"] || "N/A"}
              </p>
              <p>
                <strong>Fase:</strong> {license["LICENCIAS.fase"] || "N/A"}
              </p>
              <p>
                <strong>Barrio:</strong> {license["LICENCIAS.barrio"] || "N/A"}
              </p>
              <p>
                <strong>Distrito:</strong>{" "}
                {license["LICENCIAS.distrito"] || "N/A"}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {license["LICENCIAS.dir_obra"] || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LicensesWidget;
