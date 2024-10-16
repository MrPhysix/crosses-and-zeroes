import React from "react";
import * as styles from "./section.module.css";
import xImage from "../../images/x.svg";
import oImage from "../../images/o.svg";

export default function Section({
  number,
  section,
  isGameOver,
  handleOnSectionClick,
}) {
  const displayedImg = (() => {
    switch (section) {
      case true:
        return (
          <img className={styles.icon} src={xImage} alt="section-symbol" />
        );
      case false:
        return (
          <img className={styles.icon} src={oImage} alt="section-symbol" />
        );
      default:
        return null;
    }
  })();

  const handleOnClick = (evt) => {
    evt.preventDefault();
    if (section !== null || isGameOver) return;
    handleOnSectionClick(number);
  };

  //effects
  return (
    <button
      disabled={section !== null || isGameOver}
      className={`${styles.section} ${section !== null && styles.disabled}`}
      onClick={handleOnClick}
    >
      {displayedImg}
    </button>
  );
}
