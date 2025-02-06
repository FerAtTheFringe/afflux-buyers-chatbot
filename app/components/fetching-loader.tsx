import { useEffect, useState } from "react";
import styles from "./fetching-loader.module.css";

const FetchingLoader = ({
  fetching,
  dataResource,
}: {
  fetching: boolean;
  dataResource: string;
}) => {
  const [show, setShow] = useState(fetching);

  useEffect(() => {
    if (fetching) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300);
    }
  }, [fetching]);

  const displayResource = (dataResource: string) => {
    switch (dataResource) {
      case "query_transacciones":
        return "transacciones";
      case "query_licencias":
        return "licencias";
      default:
        return "datos";
    }
  };

  return show ? (
    <div
      className={`${styles.fetchingLoader} ${
        fetching ? styles.fadeIn : styles.fadeOut
      }`}
    >
      <span>{`🔍 Obteniendo ${displayResource(dataResource)}...`}</span>
    </div>
  ) : null;
};

export default FetchingLoader;
