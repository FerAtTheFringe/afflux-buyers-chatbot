import React, { useState } from "react";
import styles from "./transactions-widget.module.css";

const formatFinalValue = (value) => {
  if (!value) return "N/A";
  const numberValue = parseFloat(value);
  return isNaN(numberValue) ? value : numberValue.toLocaleString("es-ES");
};

const TransactionsWidget = ({ transactions = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJson, setViewJson] = useState(false);
  const show = transactions.length > 0;

  const filteredTransactions = transactions.filter((transaction) =>
    (transaction["TRANSACCIONES.buyer"]?.toLowerCase() ?? "").includes(
      searchQuery.toLowerCase()
    )
  );

  const downloadCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No hay transacciones para exportar.");
      return;
    }
  
    // Obtener todas las claves únicas de los objetos en filteredTransactions
    const allKeys = Array.from(
      new Set(filteredTransactions.flatMap(transaction => Object.keys(transaction)))
    );
  
    // Construir contenido del CSV
    const csvContent = [
      allKeys.join(","), // Cabeceras
      ...filteredTransactions.map(transaction =>
        allKeys.map(key => transaction[key] ?? "N/A").join(",") // Filas
      )
    ].join("\n");
  
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
        <h1>Transacciones</h1>
        <small>
          {filteredTransactions.length} resultados
        </small>
      </div>

      <div className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type="text"
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por comprador"
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
          {JSON.stringify(filteredTransactions, null, 2)}
        </pre>
      ) : (
        <div className={styles.companyDetails}>
          {filteredTransactions.map((transaction, index) => {
            const transactionType =
              transaction["TRANSACCIONES.transaction_type"];
            const transactionTypeFormatted = transactionType
              ? transactionType.split(" ")[1]
              : "";
            return (
              <div key={index} className={styles.companyCard}>
                <div className={styles.companyCardHeader}>
                  <h2>
                    {transactionTypeFormatted} -{" "}
                    {transaction["TRANSACCIONES.asset_type"]}
                  </h2>
                  <h4>
                    {transaction["TRANSACCIONES.source_date"]} | €
                    {formatFinalValue(transaction["TRANSACCIONES.final_value"])}
                  </h4>
                </div>

                <p>
                  {transaction["TRANSACCIONES.property_description"] || "N/A"}
                </p>

                <table className={styles.saleTable}>
                  <thead>
                    <tr>
                      <th>Compra</th>
                      <th>Vende</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{transaction["TRANSACCIONES.buyer"] || "N/A"}</td>
                      <td>{transaction["TRANSACCIONES.seller"] || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className={styles.attribute}>
                  <img className={styles.icon} src="/location.svg" />{" "}
                  <p>
                    <strong>
                      {transaction["TRANSACCIONES.municipality"] || "N/A"}.
                    </strong>{" "}
                    {transaction["TRANSACCIONES.address"] || "N/A"}.{" "}
                    <strong>
                      {transaction["AUX.m30"] ? "Dentro" : "Fuera"} de M30.
                    </strong>
                  </p>
                </div>
                {/* <p>
                  <strong>M30:</strong> {transaction["AUX.m30"] ? "Sí" : "No"}
                </p> */}
                {transaction["TRANSACCIONES.brainsre_news_es"] && (
                  <a
                    href={transaction["TRANSACCIONES.brainsre_news_es"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkButton}
                  >
                    Ver noticia
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionsWidget;
