"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import { fetchTransactions } from "@/app/utils/transactions";
import { humanQueryToSQL } from "@/app/utils/humanQueryToSQL";
import { fetchOpportunities } from "../../utils/opportunities";
import { fetchLicenses } from "@/app/utils/licenses";
import TransactionsWidget from "@/app/components/transactions-widget";

const FunctionCalling = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [licensesData, setLicensesData] = useState([]);
  const showColumn = transactionsData.length > 0 || licensesData.length > 0;

  const clearStates = () => {
    setTransactionsData([]);
    setLicensesData([]);
  };

  const functionCallHandler = async (call) => {
    if (!call?.function?.name)
      return JSON.stringify({ error: "No function name provided" });
    clearStates();
    const args = JSON.parse(call.function.arguments);

    if (call.function.name === "database_query_builder") {
      try {
        const sqlQuery = await humanQueryToSQL({
          humanQuery: args.humanQuery as string,
        });

        return sqlQuery;
      } catch (error) {
        console.error("Error querying database:", error);
        return JSON.stringify({
          error: "No se pudo obtener la query SQL",
        });
      }
    }

    if (call.function.name === "query_transacciones") {
      try {
        const data = await fetchTransactions({ ...args });

        if (!data) {
          throw new Error("No se encontraron transacciones");
        }
        setTransactionsData(data);
        return JSON.stringify(data.slice(0, 235));
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return JSON.stringify({
          error: "No se pudieron obtener transacciones",
        });
      }
    }

    if (call.function.name === "query_licencias") {
      try {
        const data = await fetchLicenses({ ...args });

        if (!data) {
          throw new Error("No se encontraron licencias");
        }
        setLicensesData(data);
        return JSON.stringify(data.slice(0, 180));
      } catch (error) {
        console.error("Error fetching licenses:", error);
        return JSON.stringify({
          error: "No se pudieron obtener licencias",
        });
      }
    }

    if (call.function.name === "search_properties") {
      try {
        const data = await fetchOpportunities({
          nombre_provincia: args.nombre_provincia,
          days_ago: args.days_ago,
          local_price_to: args.local_price_to,
          local_price_from: args.local_price_from,
          area_from: args.area_from,
          area_to: args.area_to,
          n_rooms_from: args.n_rooms_from,
          n_baths_from: args.n_baths_from,
        });

        if (!data || data.length === 0) {
          throw new Error("No se encontraron oportunidades");
        }

        return JSON.stringify(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        return JSON.stringify({
          error: "No se pudieron obtener oportunidades",
        });
      }
    }

    return JSON.stringify({ error: "Función no reconocida" });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {showColumn && (
          <div className={styles.column}>
            {transactionsData && <TransactionsWidget transactions={transactionsData} />}
          </div>
        )}

        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
