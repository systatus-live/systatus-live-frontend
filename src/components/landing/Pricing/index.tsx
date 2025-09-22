"use client"

import { CheckIcon, XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/button';
import styles from "./styles.module.scss";
import { useEffect, useState } from 'react';
import { SweetAlert } from '@/lib/sweetAlert';

export default function Pricing() {
  const [planList, setPlanList] = useState<any[]>([]);
  
  function getPlanList() {

    fetch("/api/v1/plans", {
      method: "GET"
    }).then(async (response) => {
      const json = await response.json();
      if (response.status == 200) {
        setPlanList(json.data);
      }
    }).catch((error) => {
      SweetAlert.error("", "Não foi possível enviar sua mensagem, tente novamente ou entre em contato pelo e-mail no final da página.", 5000);
    })
  }

  useEffect(() => {
    getPlanList();
  }, []);

  return (
    <div id="pricing" className="bg-gradient-to-b from-white to-gray-50 py-24">
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
              Preços
            </p>
          </motion.div>
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Escolha o plano perfeito para suas necessidades
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Todos os planos incluem nossos recursos principais de monitoramento
            com diferentes níveis de serviço.
          </p>
        </motion.div>
        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
          {planList.map((plan, index) => (
            <motion.div
              key={index}
              className={`
                relative flex flex-col rounded-2xl shadow-xl overflow-hidden
                ${plan.mostPopular ? 'border-2 border-blue-500' : 'border border-gray-200'}
              `}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            >
              {plan.mostPopular && (
                <div className={styles["most-popular"]}>
                  {/* Mais popular */}
                  Em Breve
                </div>
              )}
              <div className="p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xl font-medium text-gray-500 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    {plan.description}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    {plan.limits}
                  </p>
                </div>
                <div className="mt-6">
                  <Button severity={plan.mostPopular ? "secondary" : "info"} className="w-50 h-10">
                    <Link href="/register" className="w-full text-center">
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="py-6 px-6 bg-gray-50 space-y-6 sm:p-10">
                <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
                  Veja o que está incluso:
                </h3>
                <ul className="space-y-4">
                  {Object.entries(plan.features).map(([key, included], index) => (
                    <li key={index} className="flex items-start">
                      {included ? <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /> : <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />}
                      <span className={`ml-3 text-base ${included ? "text-gray-700" : "text-gray-400"}`}>
                        {key}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-base text-gray-500">
            Precisa de um plano personalizado?{' '}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Entre em contato com nosso time de vendas
            </Link>{' '}
            para planos  empresariais.
          </p>
        </motion.div>
      </div>
    </div>
  )
}