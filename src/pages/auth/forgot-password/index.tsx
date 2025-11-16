"use client";

import { Button } from 'primereact/button';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import AuthService from '@/services/AuthService';
import { Alert } from '@/lib/Alert';
import Loading from '@/components/Loading';
import { InputText } from 'primereact/inputtext';

type IFormValues =  {
  email: string;
}

export default function ForgotPassword() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormValues>();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(form: IFormValues) {
    setSubmitting(true);

    AuthService.forgotPassword(form.email).then((response) => {
      setIsSubmitted(true);
      setMessage(response.message);
      reset();
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <>
      <Head>
        <title>Redefinir Senha • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-center">
                <Logo />
              </div>
              <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Esqueceu a Senha?</h2>
            </div>
            <p className="text-sm mb-4">
              Insira seu endereço de e-mail para receber um link para redefinir sua senha:
            </p>
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
                <p className="text-sm mt-4">
                  {message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="block text-sm">E-mail <span className="text-red-500">*</span></label>
                  <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com" className="p-inputtext-sm" />
                </div>
                <div className="my-4">
                  <Button type="submit" className="w-full">Enviar Código</Button>
                </div>
                <p className="mt-2 text-center text-sm">
                  Lembrou a senha?{' '}
                  <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Entrar na sua conta
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
