import React from 'react';
import styles from './button.module.css'; // styles {button: '"M9qLNYd....', disabled: '"qJ32K_Ham...'} 



interface ButtonProps {
  handleOnClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  color: string;
  isActive: boolean;
  text: string;
}

export default function Button({
  handleOnClick,
  color,
  isActive,
  text,
}: ButtonProps): JSX.Element {
  console.log(styles.disabled); // {button: '"M9qLNYd....', disabled: '"qJ32K_Ham...'}
  
  return ( // <button class="undefined false"></button> 
    <button
      // className={`${!isActive && styles.disabled} ${styles.button} `}
      className={styles.disabled}
      onClick={handleOnClick}
      disabled={!isActive}
      style={{
        backgroundColor: `${isActive ? color : ''}`,
      }}
    >
      {text}
    </button>
  );
}


// import * as styles from './button.module.css'; // TS2339: Property 'disabled' does not exist on type 'typeof import("*.module.css")'.
// import styles from './button.module.css'; // styles undefined && пустой рендер
