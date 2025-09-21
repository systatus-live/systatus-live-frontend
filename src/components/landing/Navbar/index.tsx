"use client"

import Button from '@/components/button';
import Logo from '@/components/logo';
import { AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItemList = [
    { name: "Início", href: "/" },
    { name: "Funtionalidades", href: "#features" },
    { name: "Integrações", href: "#integrations" },
    { name: "Preços", href: "#pricing" },
    { name: "Suporte", href: "/contact" },
  ]

  useEffect(() => { }, [])

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Web */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItemList.map((item, index) => (
                <Link key={index} href={item.href} className={styles["nav-item"]}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center ml-4">
            <Button severity="info">Entrar</Button>
            <Button severity="secondary" className="ml-4">Cadastrar</Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile  */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="sm:hidden bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {navItemList.map((item, index) => (
                <Link href={item.href} className={styles["nav-item-mobile"]} onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <Button severity="info" className="w-full" onClick={() => setIsMenuOpen(false)}>Entrar</Button>
                <Button severity="secondary" className="ml-2 w-full" onClick={() => setIsMenuOpen(false)}>Cadastrar</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}
export default Navbar
