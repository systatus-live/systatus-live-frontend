"use client"

import Image from 'next/image';
import Link from 'next/link';
import styles from "./styles.module.scss";

export default function Logo(props: { inverted?: boolean, iconOnly?: boolean }) {
  return (
    <div className="flex items-center">
      <Image src={props.inverted ? "/logos/systatus-live-white.png" : "/logos/systatus-live.png"} alt="Logo" width={26} height={26} className="mr-2" />
      <Link href="/" className={`${props.iconOnly ? styles["hidden-text"] : ""} ${props.inverted ? styles["logo-white"] : styles["logo"]}`}>Systatus.Live</Link>
    </div>
  )
}