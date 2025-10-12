"use client"

import { ButtonHTMLAttributes, ClassAttributes, JSX, useEffect, useState } from 'react';
import styles from "./styles.module.scss";

export default function Button(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement> & { outlined?: boolean, severity?: "success" | "secondary" | "info" | "danger" }) {
  const [btnStyle, setBtnStyle] = useState("");

  useEffect(() => {
    switch (props.severity) {
      case "success":
        setBtnStyle(props.outlined ? styles["btn-success-outlined"] : styles["btn-success"]);
        break;
      case "secondary":
        setBtnStyle(props.outlined ? styles["btn-secondary-outlined"] : styles["btn-secondary"]);
        break;
      case "info":
        setBtnStyle(props.outlined ? styles["btn-info-outlined"] : styles["btn-info"]);
        break;
      case "danger":
        setBtnStyle(props.outlined ? styles["btn-danger-outlined"] : styles["btn-danger"]);
        break;
      default:
        setBtnStyle(props.outlined ? styles["btn-default-outlined"] : styles["btn-default"]);
        break;
    }
  }, []);

  return (
    <button {...props} className={`${btnStyle} ${props.disabled ? styles["btn-disabled"] : ""} cursor-pointer ${props.className ?? ""}`}>{props.children}</button>
  )
}