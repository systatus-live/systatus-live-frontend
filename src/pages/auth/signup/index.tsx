"use client";

import Button from '@/components/Button';
import InputCheckBox from '@/components/InputCheckbox';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import Logo from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";

interface IFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormValues>();

  function onSubmit(data: IFormValues) {
    // TODO API request
    setSubmitting(true);
    reset();
    setSubmitting(false);

    router.push({
      pathname: "/auth/verify-account",
      query: { email: data.email }
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Crie sua conta</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome <span className="text-red-500">*</span></label>
              <InputText type="text" placeholder="Nome completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></label>
              <InputText type="email" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha <span className="text-red-500">*</span></label>
              <InputPassword placeholder="********" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Senha <span className="text-red-500">*</span></label>
              <InputPassword placeholder="********" />
            </div>
            <div className="flex items-center">
              <InputCheckBox />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Eu aceito os {' '}
                <Link href="/agreements/terms-of-use" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Termos de Uso</Link>{' '}
                e a{' '}
                <Link href="/agreements/privacy-policy" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Política de Privacidade</Link>
              </label>
            </div>
            <div className="my-4">
              <Button severity="secondary" type="submit" className="w-full">Criar Conta</Button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Já possui uma conta?{' '}
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
