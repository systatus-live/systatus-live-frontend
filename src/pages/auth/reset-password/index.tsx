"use client";

import Button from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import AuthService from '@/services/AuthService';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";

interface IFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<IFormValues>();

  function onSubmit(form: IFormValues) {
    setSubmitting(true);

    AuthService.resetPassword(form.password, token as string).then((response: any) => {
      router.push({
        pathname: "/auth/signin"
      });
      Alert.success("", response.message);
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <>
      <Head>
        <title>Redefinir Senha • Systatus.Live</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Redefinir Senha</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha <span className="text-red-500">*</span></label>
                <InputPassword {...register("password", { required: true })} placeholder="********" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Senha <span className="text-red-500">*</span></label>
                <InputPassword {...register("confirmPassword", { required: true })} placeholder="********" />
              </div>
              <div className="my-4">
                {isSubmitting}
                <Button severity="secondary" type="submit" className="w-full" disabled={isSubmitting}>Redefinir Senha</Button>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Cancelar redefinição de senha?{' '}
                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Entrar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
