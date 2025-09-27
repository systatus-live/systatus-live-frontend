import Button from '@/components/Button';
import Footer from '@/components/LandingPage/Footer';
import Navbar from '@/components/LandingPage/Navbar';
import { SweetAlert } from '@/lib/sweetAlert';
import { motion } from 'framer-motion';
import { CheckIcon, MailIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function Contact() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<any>()

  function onSubmit(data: SubmitHandler<any>) {
    setSubmitting(true);

    fetch("/api/v1/mails", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (response) => {
      const json = await response.json();
      if (response.status == 200) {
        setIsSubmitted(true);
        reset();
      } else {
        SweetAlert.error("", json.message, 5000);
      }
    }).catch((_) => {
      SweetAlert.error("", "Não foi possível enviar sua mensagem, tente novamente ou fale diretamente com systatus@artcode.dev.", 5000);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Entre em Contato
              </h1>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Tem dúvidas sobre nosso serviço de monitoramento? Estamos aqui para ajudar.
              </p>
            </motion.div>
            <div className="mt-16 lg:mt-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-x-2">
                          <MailIcon></MailIcon>
                          E-mail
                        </h2>
                        <p className="mt-1 text-gray-500">
                          systatus@artcode.dev
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-x-2">
                          <MapPinIcon></MapPinIcon>
                          Endereço Fiscal
                        </h2>
                        <p className="mt-1 text-gray-500">
                          Av. Anselmo Alves dos Santos, 1076, loja 01, CXPST 98
                          <br />
                          Uberlândia-MG, CEP 38408-097, Brasil
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 sm:p-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {isSubmitted ? (
                    <div className="text-center py-16">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
                      >
                        <CheckIcon className="h-8 w-8 text-green-600" />
                      </motion.div>
                      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                        Recebemos sua mensagem!
                      </h2>
                      <p className="mt-2 text-gray-500">
                        Retornaremos o mais breve possível.
                      </p>
                      <Button severity="secondary" onClick={() => setIsSubmitted(false)} className="mt-2">
                        Enviar outra mensagem
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label className="block text-sm/6 font-medium text-gray-900">Nome <span className="text-red-700">*</span></label>
                          <div className="mt-2">
                            <input {...register("name")} type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                          </div>
                        </div>
                        {/* E-mail */}
                        <div>
                          <label className="block text-sm/6 font-medium text-gray-900">E-mail <span className="text-red-700">*</span></label>
                          <div className="mt-2">
                            <input {...register("email")} type="email" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                          </div>
                        </div>
                      </div>
                      {/* Subject */}
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Assunto <span className="text-red-700">*</span></label>
                        <div className="mt-2">
                          <input {...register("subject")} type="subject" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                        </div>
                      </div>
                      {/* Message */}
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Mensagem <span className="text-red-700">*</span></label>
                        <div className="mt-2">
                          <textarea {...register("message")} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} severity="secondary">{isSubmitting ? "Enviando.." : "Enviar Mensagem"}</Button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}