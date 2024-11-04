import React, { useEffect, useState } from 'react';
import styles from './modal.module.css';
import Button from '../Button/Button';
import xImage from '@images/x.svg';
import oImage from '@images/o.svg';

interface ModalProps {
  eventState?: boolean;
  winner?: boolean | null;
}

export default function Modal({
  eventState,
  winner,
}: ModalProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const displayedImg = (() => {
    switch (winner) {
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

  useEffect(() => {
    if (eventState) setIsOpen(eventState);
  }, [eventState]);

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalWrapper}>
        <p>
          {winner !== null ? (
            <>
              {displayedImg}
              {`Player ${winner ? '1' : '2'} claims the win! `}
            </>
          ) : (
            "No winners today, just two great players! It's a tie!"
          )}
        </p>
        <Button
          text={'Close Modal'}
          handleOnClick={handleOnClose}
          color={'green'}
          isActive={true}
        />
      </div>
    </div>
  );
}
