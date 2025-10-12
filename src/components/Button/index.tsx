"use client"

import { ButtonHTMLAttributes, ClassAttributes, JSX, useEffect, useState } from 'react';
import styles from "./styles.module.scss";

export default function Button(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement> & { outlined?: boolean, severity?: "success" | "secondary" | "info" | "danger" }) {
  const [btnStyle, setBtnStyle] = useState("");

  const btnProps = {
    ...props,
    outlined: props.outlined == null ? null : props.outlined.toString()
  }

  useEffect(() => {
    switch (btnProps.severity) {
      case "success":
        setBtnStyle(btnProps.outlined ? styles["btn-success-outlined"] : styles["btn-success"]);
        break;
      case "secondary":
        setBtnStyle(btnProps.outlined ? styles["btn-secondary-outlined"] : styles["btn-secondary"]);
        break;
      case "info":
        setBtnStyle(btnProps.outlined ? styles["btn-info-outlined"] : styles["btn-info"]);
        break;
      case "danger":
        setBtnStyle(btnProps.outlined ? styles["btn-danger-outlined"] : styles["btn-danger"]);
        break;
      default:
        setBtnStyle(btnProps.outlined ? styles["btn-default-outlined"] : styles["btn-default"]);
        break;
    }
  }, []);

  return (
    <button {...btnProps} className={`${btnStyle} ${btnProps.disabled ? styles["btn-disabled"] : ""} cursor-pointer ${btnProps.className ?? ""}`}>{btnProps.children}</button>
  )
}