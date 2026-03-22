import { motion } from 'framer-motion';
import { BellRingIcon, PlusCircleIcon, ShieldCheckIcon } from 'lucide-react';

const steps = [
  {
    icon: PlusCircleIcon,
    color: "bg-blue-500",
    step: "01",
    title: "Cadastre seu endpoint",
    description: "Informe a URL do seu site, API ou servidor. Nenhum agente para instalar — só cole o endereço e pronto.",
  },
  {
    icon: ShieldCheckIcon,
    color: "bg-indigo-500",
    step: "02",
    title: "Monitoramos continuamente",
    description: "Verificamos sua aplicação a cada 60 segundos a partir de múltiplas regiões para eliminar falsos positivos.",
  },
  {
    icon: BellRingIcon,
    color: "bg-green-500",
    step: "03",
    title: "Você recebe o alerta",
    description: "Em menos de 30 segundos após a detecção, você é notificado no Slack, WhatsApp, Discord, e-mail ou Google Chat.",
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 bg-white">
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
            <p className="text-sm font-medium text-blue-600 tracking-wide uppercase">Como funciona</p>
          </motion.div>
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Configurado em menos de 2 minutos
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Sem instalações, sem agentes, sem complicação. Só cole seu endpoint e nós cuidamos do resto.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gray-100" style={{ left: '16.66%', right: '16.66%' }} />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
              >
                <div className="relative z-10">
                  <span className={`inline-flex items-center justify-center p-4 ${step.color} rounded-2xl shadow-lg`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </span>
                </div>
                <div className="mt-6">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{step.step}</span>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
