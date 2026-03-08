import { Alert } from '@/lib/Alert';
import HttpService from '@/services/HttpService';
import { motion } from 'framer-motion';
import { CheckIcon, MailIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

type IFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, control, watch } = useForm<IFormValues>()
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
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="py-16 sm:py-24">
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
                  className="lg:col-span-2 border-1 border-gray-200 rounded-lg p-6 sm:p-8"
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
                        <Field>
                          <FieldLabel>Nome <span className="text-red-500">*</span></FieldLabel>
                          <Input {...register("name", { required: true })} type="text" />
                        </Field>
                        {/* E-mail */}
                        <Field>
                          <FieldLabel>E-mail <span className="text-red-500">*</span></FieldLabel>
                          <Input {...register("email", { required: true })} type="email" />
                        </Field>
                      </div>
                      {/* Subject */}
                      <Field>
                        <FieldLabel>Assunto <span className="text-red-500">*</span></FieldLabel>
                        <Controller name="subject" control={control} rules={{ required: true }} render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um assunto" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjectList.map((option) => (
                                <SelectItem key={option.description} value={option.description}>
                                  {option.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )} />
                      </Field>
                      {/* Message */}
                      <Field>
                        <FieldLabel>Mensagem <span className="text-red-500">*</span></FieldLabel>
                        <Textarea {...register("message", { required: true })} rows={5} maxLength={4000} />
                        <small>{watch("message")?.length ?? 0}/4000</small>
                      </Field>
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
    </div>
  )
}