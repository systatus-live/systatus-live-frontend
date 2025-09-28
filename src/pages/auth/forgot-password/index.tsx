"use client";

import Button from '@/components/Button';
import InputText from '@/components/InputText';
import Logo from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";

interface IFormValues {
  email: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormValues>();

  function onSubmit(data: IFormValues) {
    // TODO API request
    setSubmitting(true);
    reset();
    setSubmitting(false);

    router.push("/auth/verify-code")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Redefinir Senha</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Insira seu endereço de e-mail para receber um código para redefinir sua senha:
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></label>
              <InputText type="email" placeholder="seu@email.com" />
            </div>
            <div className="my-4">
              <Button severity="secondary" type="submit" className="w-full">Enviar Código</Button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Lembrou a senha?{' '}
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Entrar na sua conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
