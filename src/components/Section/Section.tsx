import React, { ReactEventHandler } from 'react';
import * as styles from './section.module.css';
// @ts-ignore
import xImage from '../../images/x.svg';
// @ts-ignore
import oImage from '../../images/o.svg';

type Section = boolean | null;

interface SectionProps {
  number: number;
  section: Section;
  isGameOver?: boolean;
  handleOnSectionClick: (number: number) => Promise<void>;
}

export default function Section({
  number,
  section,
  isGameOver,
  handleOnSectionClick,
}: SectionProps): JSX.Element {
  const displayedImg = (() => {
    switch (section) {
      case true:
        return (
          // @ts-ignore
          <img className={styles.icon} src={xImage} alt="section-symbol" />
        );
      case false:
        return (
          // @ts-ignore
          <img className={styles.icon} src={oImage} alt="section-symbol" />
        );
      default:
        return null;
    }
  })();

  const handleOnClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (section !== null || isGameOver) return;
    // handleOnSectionClick(number);
    handleOnSectionClick(number);
  };

  //effects
  return (
    <button
      disabled={section !== null || isGameOver}
      // @ts-ignore
      className={`${styles.section} ${section !== null && styles.disabled}`}
      onClick={handleOnClick}
    >
      {displayedImg}
    </button>
  );
}
