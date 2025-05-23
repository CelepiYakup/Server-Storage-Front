"use client";
import styles from "./Card.module.scss";

type Props = {
  title: string;
  text?: string;
  isActive: boolean;
  onClick: any; //FIXME:
  checkbox?: boolean;
  children?: React.ReactNode;
};

const Card = ({
  title,
  text,
  isActive = true,
  onClick,
  checkbox = false,
  children,
}: Props) => {
  return (
    <div
      className={`${styles.cardContainer} ${
        isActive && styles.cardContainer__active
      }`}
      onClick={onClick}
    >
      {checkbox && (
        <input
          type="checkbox"
          className={styles.optionCheckbox}
          checked={isActive}
          readOnly
        />
      )}
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
      </div>
      {children}
    </div>
  );
};

export default Card;
