"use client";

import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { GlobeIcon, Waypoints } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import Image from "next/image"

export default function Hero() {
  const [integrationList, setIntegrationList] = useState<any[]>([]);
  const [cardList, setCardList] = useState<any[]>([]);

  useEffect(() => {
    setIntegrationList([
      {
        name: "Slack",
        logo: "logos/slack.svg",
      },
      {
        name: "Google Chat",
        logo: "logos/google-chat.svg",
      },
      {
        name: "E-mail",
        logo: "logos/mail.svg",
      },
      {
        name: "WhatsApp",
        logo: "logos/whatsapp.svg",
      },
      {
        name: "Discord",
        logo: "logos/discord.svg",
      },
      {
        name: "Telegram",
        logo: "logos/telegram.svg",
      },
    ])

    setCardList([
      {
        title: "website.com",
        icon: GlobeIcon,
        color: "green",
        uptime: "Disponibilidade 92%",
        progress: "92%"
      },
      {
        title: "api.service.com",
        icon: Waypoints,
        color: "red",
        uptime: "Incidente detectado",
        progress: "45%"
      },
    ])
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.h1
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block xl:inline">Monitore seus aplicativos com</span>{' '}
                <motion.span
                  className={`block ${styles["secondary"]}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  systatus.live
                </motion.span>
              </motion.h1>
              <motion.p
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Receba notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis.
                Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real.
              </motion.p>
              <motion.div
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button severity="secondary" className="mr-3 h-10">Comece agora</Button>
                <Button severity="info" className="h-10">
                  <Link href="#features">Saiba mais</Link>
                </Button>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-r from-blue-400 to-blue-600 sm:h-72 lg:h-full flex items-center justify-center">
          <div className="relative">
            <div className="grid grid-cols-1 gap-4 p-8 relative z-20">
              {cardList.map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <card.icon className={`h-5 w-5 mr-2`} />
                    <span className="text-sm font-medium">{card.title}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className={`h-2 rounded-full bg-${card.color}-500`}
                      initial={{ width: 0 }}
                      animate={{ width: card.progress }}
                      transition={{ delay: 0.5, duration: 1 }}
                    ></motion.div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-500">{card.uptime}</p>
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex items-center"
                    >
                      <span className={`h-2 w-2 rounded-full bg-${card.color}-500 inline-block`}></span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Circular */}
            <div className="absolute w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {integrationList.map((integration, index) => {
                const angle = index * (360 / integrationList.length) * (Math.PI / 180);
                const radius = 175;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <Fragment key={index}>
                    <motion.div
                      className="absolute bg-white rounded-full p-2 shadow-lg z-10"
                      style={{ width: 48, height: 48, left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    >
                      <Image
                        src={integration.logo}
                        alt={integration.name}
                        className="w-full h-full object-contain"
                        height={48}
                        width={48}
                      />
                    </motion.div>
                    {integrationList.length > 1 && (
                      <motion.div
                        className="absolute bg-white rounded-full z-0"
                        style={{
                          width: 6,
                          height: 6,
                          left: `calc(50% + ${radius * Math.cos(angle + Math.PI / integrationList.length)}px - 3px)`,
                          top: `calc(50% + ${radius * Math.sin(angle + Math.PI / integrationList.length)}px - 3px)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      />
                    )}
                  </Fragment>
                )
              })}
            </div>
            {/* Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                zIndex: 5,
                width: '450px',
                height: '450px',
              }}
            >
              <motion.circle
                cx="50%"
                cy="50%"
                r="175"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="175"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{ delay: 1, duration: 60, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
