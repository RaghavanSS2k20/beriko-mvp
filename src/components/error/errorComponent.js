import React from "react";
import styles from "./error.module.css";

export default function ErrorPage({ statusCode, title, description }) {
  return (
    <div className={styles.container}>
      {statusCode && <h1 className={styles.statusCode}>{statusCode}</h1>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
