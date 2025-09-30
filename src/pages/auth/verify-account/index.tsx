"use client";

import Button from '@/components/Button';
import InputText from '@/components/InputText';
import Logo from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import OtpInput from 'react-otp-input';
import AuthService from '@/services/AuthService';
import { SweetAlert } from '@/lib/sweetAlert';
import Head from 'next/head';

interface IFormValues {
  code: string;
}

export default function VerifyAccount() {
  const router = useRouter();
  const { email, redirect } = router.query;

  const [isSubmitting, setSubmitting] = useState(false);
  const { handleSubmit } = useForm<IFormValues>();
  const [otp, setOtp] = useState("");

  function onSubmit(_: IFormValues) {
    setSubmitting(true);

    AuthService.checkCode(otp).then((response: any) => {
      router.push(redirect ? redirect as string : "/auth/signin");
      SweetAlert.success("", response.message);
    }).catch((error) => {
      SweetAlert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <>
      <Head>
        <title>Verificar Conta • Systatus.Live</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-center">
                <Logo />
              </div>
              <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Insira o código</h2>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Insira o <strong>código de verificação</strong> enviado para seu e-mail {email && (<strong>{email}</strong>)}.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="mx-1"></span>}
                  renderInput={(props) => <InputText {...props} />}
                  skipDefaultStyles={true}
                />
              </div>
              <div className="my-4">
                <Button severity="secondary" type="submit" className="w-full" disabled={isSubmitting}>Enviar Código</Button>
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
    </>
  )
}
