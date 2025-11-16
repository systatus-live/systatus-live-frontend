"use client";

import { Button } from 'primereact/button';
import InputCheckBox from '@/components/InputCheckbox';
import Logo from '@/components/Logo';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import AuthService from '@/services/AuthService';
import { useRouter } from 'next/router';
import { Alert } from '@/lib/Alert';
import Loading from '@/components/Loading';
import { InputText } from 'primereact/inputtext';

type IFormValues =  {
  email: string;
  password: string;
  type: SignInTypeEnum
}

export default function SignIn() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<IFormValues>();

  function onSubmit(form: IFormValues) {
    setSubmitting(true);

    AuthService.authLocal({
      email: form.email,
      password: form.password,
      type: SignInTypeEnum.EMAIL_PASSWORD,
    }).then((_) => {
      router.push("/panel");
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <>
      <Head>
        <title>Entrar • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Entrar</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm">E-mail <span className="text-red-500">*</span></label>
                <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com"  className="p-inputtext-sm" />
              </div>
              <div>
                <label className="block text-sm">Senha <span className="text-red-500">*</span></label>
                <InputText {...register("password", { required: true })} placeholder="********" type="password"  className="p-inputtext-sm" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <InputCheckBox />
                  <label className="ml-2 block text-sm ">
                    Manter conectado
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="my-4">
                <Button type="submit" className="w-full">Entrar</Button>
              </div>
              <p className="mt-2 text-center text-sm">
                Não possui uma conta?{' '}
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Crie uma gratuitamente
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}