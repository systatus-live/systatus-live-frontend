import Footer from '@/components/LandingPage/Footer';
import Navbar from '@/components/LandingPage/Navbar';
import { Alert } from '@/lib/Alert';
import HttpService from '@/services/HttpService';
import { motion } from 'framer-motion';
import { CheckIcon, MailIcon, MapPinIcon } from 'lucide-react';
import Head from 'next/head';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

type IFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, control, watch, setValue } = useForm<IFormValues>()
  const subjectList = [
    { description: "Conta e acesso" },
    { description: "Sugestões, bugs e melhorias" },
    { description: "Planos e cobrança" },
    { description: "Encerramento de conta" },
    { description: "Outros assuntos" },
  ]

  function onSubmit(data: IFormValues) {
    setSubmitting(true);

    HttpService.post("/api/v1/mails", data, {}).then((response) => {
      setIsSubmitted(true);
      reset();
    }).catch((_) => {
      Alert.error("", "Não foi possível enviar sua mensagem, tente novamente ou fale diretamente com systatus@artcode.dev.", 5000);
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <>
      <Head>
        <title>Contato • Systatus.Live</title>
      </Head>
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
                        <p className="my-2 text-gray-500">
                          Retornaremos o mais breve possível.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)}>
                          Enviar outra mensagem
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                          {/* Name */}
                          <div className="w-full">
                            <label className="block text-sm">Nome <span className="text-red-500">*</span></label>
                            <InputText {...register("name", { required: true })} type="text" className="p-inputtext-sm" />
                          </div>
                          {/* E-mail */}
                          <div>
                            <label className="block text-sm">E-mail <span className="text-red-500">*</span></label>
                            <InputText {...register("email", { required: true })} type="email" className="p-inputtext-sm" />
                          </div>
                        </div>
                        {/* Subject */}
                        <div>
                          <label className="block text-sm">Assunto <span className="text-red-500">*</span></label>
                          {/* <InputText {...register("subject", { required: true })} type="subject" className="p-inputtext-sm" /> */}
                          <Controller name="subject" control={control} rules={{ required: true }} render={({ field }) => (
                            <Dropdown
                              {...field}
                              inputRef={field.ref}
                              value={watch("subject")}
                              onChange={(option) => setValue("subject", option.value)}
                              options={subjectList}
                              optionLabel="description"
                              optionValue="description"
                              filter={true}
                              itemTemplate={(option) => (
                                <span>{option.description}</span>
                              )}
                              valueTemplate={(option) => (
                                option == null ?
                                  <div>&#8203;</div> :
                                  <span>{option.description}</span>
                              )}
                              className="p-inputtext-sm"
                            />
                          )} />
                        </div>
                        {/* Message */}
                        <div>
                          <label className="block text-sm">Mensagem <span className="text-red-500">*</span></label>
                          <InputTextarea {...register("message", { required: true })} rows={5} className="p-inputtext-sm" />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Enviando.." : "Enviar Mensagem"}</Button>
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
    </>
  )
}