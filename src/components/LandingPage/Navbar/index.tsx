import Logo from '@/components/Logo';
import { AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from "./styles.module.css";
import { useGlobalProvider } from '@/providers/GlobalProvider';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setLoading } = useGlobalProvider();

  const navItemList = [
    { name: "Início", href: "/" },
    { name: "Funcionalidades", href: "/#features" },
    { name: "Integrações", href: "/#integrations" },
    { name: "Preços", href: "/#pricing" },
    { name: "Contato", href: "/contact" },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Web */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden sm:flex sm:items-center ml-4 space-x-3">
            <Link href="/auth/signin" onClick={() => setLoading(true)}>
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Criar Conta</Button>
            </Link>
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
                <Link key={index} href={item.href} className={styles["nav-item-mobile"]} onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <Link href="/auth/signin" onClick={() => setLoading(true)}>
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Criar Conta</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}
export default Navbar
