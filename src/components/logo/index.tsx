"use client"

import Image from 'next/image';
import Link from 'next/link';
import styles from "./index.module.scss";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src="/logos/systatus-live.png" alt="Logo" width={26} height={26} className="mr-2" />
      <Link href="/" className={styles["logo"]}>
        Systatus.Live
      </Link>
    </div>
  )
}