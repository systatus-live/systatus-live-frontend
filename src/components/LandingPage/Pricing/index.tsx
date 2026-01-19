"use client"

import { Alert } from '@/lib/Alert';
import PlanService from '@/services/PlanService';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import styles from "./styles.module.scss";
import formatMoney from '@/utils/formatMoney';

export default function Pricing() {
  const [planList, setPlanList] = useState<any[]>([]);

  async function getPlanList() {
    try {
      const response = await PlanService.getPlanList();
      setPlanList(response.data);
    } catch (error: any) {
      Alert.error("", error.message);
    }
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
        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {planList.length == 0 ? <></> : (
            <>
              {planList.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`
                relative flex flex-col rounded-2xl shadow-xl overflow-hidden
                ${plan.mostPopular ? 'border-2 border-blue-500' : 'border border-gray-200'}
                p-6 
              `}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                >
                  <div>
                    <div>
                      <div className="flex justify-center">{plan.mostPopular ? <span className={styles["most-popular"]}>🌟 Mais Popular 🌟</span> : <></>}</div>
                      <div className="flex flex-col items-center">
                        <div style={{ width: 58, height: 58, position: "relative", overflow: "hidden" }}>
                          <Image src={plan.image} alt="Plano" fill sizes={`${58}px`} style={{ objectFit: "contain" }} priority />
                        </div>
                        <h1 className="font-semibold text-gray-900 mt-2">Plano {plan.name}</h1>
                      </div>
                      <div className="flex justify-center items-baseline mt-2">
                        <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price == 0 ? "Grátis" : formatMoney(plan.price)}</span>
                        {plan.period && <span className="text-xl font-medium text-gray-500 ml-1">{plan.period}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 mt-2 rounded-lg">
                    <h3 className="text-center text-gray-500 mb-6">{plan.description}</h3>
                    <ul className="space-y-4">
                      {Object.entries(plan.features).map(([key, included], index) => (
                        <li key={index} className="flex items-start">
                          {included ? <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /> : <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />}
                          <span className={`ml-3 ${included ? "text-gray-700" : "text-gray-400"}`}>{key}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 p-fluid">
                      <Link href={plan.btaLink}>
                        <Button>{plan.bta}</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
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