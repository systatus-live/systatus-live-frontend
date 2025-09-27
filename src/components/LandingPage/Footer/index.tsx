"use client"

import Logo from '@/components/logo'
import { motion } from 'framer-motion'
import { ArrowUpIcon } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const navItemList = [
    {
      title: "Produto",
      items: [
        { name: "Funcionalidades", href: "#features", target: "" },
        { name: "Integrações", href: "#integrations", target: "" },
        { name: "Preços", href: "#pricing", target: "" },
      ]
    },
    {
      title: "Suporte",
      items: [
        { name: "Contato", href: "/contact", target: "" },
      ]
    },
    {
      title: "Legal",
      items: [
        { name: "Privacidade", href: "agreements/privacy-policy", target: "_blank" },
        { name: "Termos de Uso", href: "agreements/terms-of-use", target: "_blank" },
      ]
    }
  ]

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Logo inverted={true}/>
              <p className="text-gray-300 text-base mt-4">
                Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real.
              </p>
            </motion.div>
          </div>
          <div className="mt-12 grid gap-8 xl:mt-0 xl:col-span-2">
            <div className="grid justify-center sm:justify-center md:grid-cols-3 gap-8">
              {navItemList.map((nav, index) => (
                <div key={index} className="mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <h3 className="text-sm font-semibold text-blue-400 tracking-wider uppercase">
                      {nav.title}
                    </h3>
                    <ul className="mt-4 space-y-4">
                      {nav.items.map((item, index) => (
                        <li key={index}>
                          <Link href={item.href} target={item.target} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            className="text-base text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            &copy; {new Date().getFullYear()} systatus.live. Todos os direitos reservados.
          </motion.p>
          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-full transition-colors duration-200 group cursor-pointer"
            whileHover={{ y: -3 }}
            whileTap={{ y: 0 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <ArrowUpIcon className="h-5 w-5 group-hover:text-white" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}