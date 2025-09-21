"use client"

import { ButtonHTMLAttributes, ClassAttributes, JSX, useEffect, useState } from 'react';
import styles from "./index.module.scss";

export default function Button(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement> & { severity?: "success" | "secondary" | "info" }) {
  const [btnStyle, setBtnStyle] = useState("");

  useEffect(() => {
    switch (props.severity) {
      case "success":
        setBtnStyle(styles["btn-success"]);
        break;
      case "secondary":
        setBtnStyle(styles["btn-secondary"]);
        break;
      case "info":
        setBtnStyle(styles["btn-info"]);
        break;
      default:
        setBtnStyle(styles["btn-default"]);
        break;
    }
  }, []);

  return (
    <button {...props} className={`${btnStyle} cursor-pointer ${props.className ?? ""}`}>{props.children}</button>
  )
}