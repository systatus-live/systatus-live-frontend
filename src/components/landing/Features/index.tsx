"use client"

import Button from '@/components/button';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, BarChart2Icon, BellIcon, ClockIcon, GlobeIcon, MessageSquareIcon } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      name: "Monitoramento",
      description: "Monitore sites, APIs e servidores com verificações globais frequentes para identificar problemas rapidamente.",
      icon: GlobeIcon,
      color: "bg-blue-500",
    },
    {
      name: "Alertas Instantâneos",
      description: "Receba notificações imediatas quando seus serviços ficarem indisponíveis por e-mail, Discord, Slack ou Google Chat.",
      icon: BellIcon,
      color: "bg-red-500",
    },
    {
      name: "Histórico de Disponibilidade",
      description: "Acompanhe o histórico de disponibilidade dos seus serviços para identificar padrões de problemas.",
      icon: ClockIcon,
      color: "bg-green-500",
    },
    {
      name: "Gestão de Incidentes",
      description: "Gerencie e acompanhe incidentes com relatórios detalhados e métricas de tempo de resposta.",
      icon: AlertTriangleIcon,
      color: "bg-yellow-500",
    },
    {
      name: "Colaboração em Equipe",
      description: "Colabore com sua equipe compartilhando monitores e configurando regras de notificação baseadas em equipe.",
      icon: MessageSquareIcon,
      color: "bg-purple-500",
    },
    {
      name: "Análise de Desempenho",
      description: "Acompanhe tempos de resposta e métricas de desempenho para garantir que seus serviços sejam rápidos.",
      icon: BarChart2Icon,
      color: "bg-indigo-500",
    },
  ]

  const container = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div id="featureList" className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block rounded-full bg-blue-100 px-4 py-1.5 mb-4"
          >
            <p className="text-sm font-medium text-blue-600 tracking-wide uppercase">
              Funcionalidades
            </p>
          </motion.div>
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Saiba quando seus sistemas saírem do ar
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Notificaremos você sobre indisponibilidades nos seus sistemas
            para que possa agir rapidamente e mantê-los funcionando
          </p>
        </motion.div>
        <motion.div
          className="mt-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {featureList.map((feature, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={item}
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full shadow-lg border border-gray-100 relative z-10 transition-all duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className={`inline-flex items-center justify-center p-3 ${feature.color} rounded-md shadow-lg`}>
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true"/>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg transform scale-[0.98] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 -z-10"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button severity="secondary" className="h-10">Comece a monitorar seus serviços</Button>
        </motion.div>
      </div>
    </div>
  )
}
