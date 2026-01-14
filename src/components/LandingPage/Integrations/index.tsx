"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Integrations() {
  const integrations = [
    {
      name: "Slack",
      logo: "logos/slack.svg",
      description: "Receba alertas instantâneos diretamente nos seus canais do Slack.",
    },
    {
      name: "Google Chat",
      logo: "logos/google-chat.svg",
      description: "Acompanhe a disponibilidade dos sistemas via mensagens no Google Chat.",
    },
    {
      name: "E-mail",
      logo: "logos/mail.svg",
      description: "Receba notificações imediatas por e-mail assim que houver indisponibilidade.",
    },
    {
      name: "WhatsApp",
      logo: "logos/whatsapp.svg",
      description: "Tenha alertas em tempo real no seu WhatsApp, onde quer que esteja.",
    },
    {
      name: "Discord",
      logo: "logos/discord.svg",
      description: "Seja notificado em tempo real no seu servidor do Discord.",
    },
  ]

  return (
    <div id="integrations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block rounded-full bg-blue-100 px-4 py-1.5 mb-4"
          >
            <p className="text-sm font-medium text-blue-600 tracking-wide uppercase">
              Integrações
            </p>
          </motion.div>
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Seja notificado onde preferir
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            systatus.live integra com as principais plataformas para garantir que você nunca perca um alerta
          </p>
        </motion.div>
        <motion.div
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <div className="p-8">
                <div className="flex items-center">
                  <div className="h-14 w-14 flex-shrink-0">
                    <Image
                      src={integration.logo}
                      alt={integration.name}
                      height={0}
                      width={0}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-xl text-gray-900">{integration.name}</h3>
                    <p className="mt-1 text-gray-500">{integration.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
