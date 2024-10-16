import React from "react";
import * as styles from "./button.module.css";

export default function Button({ handleOnClick, color, isActive, text }) {
  return (
    <button
      className={`${!isActive ? styles.disabled : ""} ${styles.button} `}
      onClick={handleOnClick}
      disabled={!isActive}
      style={{
        backgroundColor: `${isActive ? color : ""}`,
      }}
    >
      {text}
    </button>
  );
}
