"use client"

import Image from 'next/image';
import Link from 'next/link';
import styles from "./styles.module.css";

export default function Logo(props: { inverted?: boolean }) {
  return (
    <Link href="/" className={`flex items-center ${props.inverted ? styles["logo-white"] : styles["logo"]}`}>
      <Image src={props.inverted ? "/logos/systatus-live-white.png" : "/logos/systatus-live.png"} alt="Logo" width={26} height={26} />
      <span className={`${styles["hidden-text"]} ml-2`}>Systatus.Live</span>
    </Link>
  )
}