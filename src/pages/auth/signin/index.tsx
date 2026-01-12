"use client";

import Loading from '@/components/Loading';
import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import AuthService from '@/services/AuthService';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import Script from 'next/script'
import { Divider } from 'primereact/divider';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';

type IFormValues = {
  email: string;
  password: string;
  type: SignInTypeEnum | null,
  keepConected: boolean
}

export default function SignIn() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { control, register, handleSubmit, getValues } = useForm<IFormValues>({
    values: {
      email: "",
      password: "",
      type: null,
      keepConected: false
    }
  });

  useEffect(() => {
    if ((window as any).google) {
      initGsi();
    }
  }, []);

  function initGsi() {
    const google = (window as any).google

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      callback: (response: any) => onSubmitGoogle(response)
    })

    google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular"
      }
    )
  }

  function submit(form: SignInOptionsDTO) {
    setSubmitting(true);

    AuthService.signInLocal(form).then((response) => {
      if (response.signUpSignInFlow) {
        router.push({
          pathname: "/auth/signup",
          query: {
            name: response.name,
            email: response.email,
            signUpSignInFlow: true,
            keepConected: form.keepConected
          }
        });
      } else {
        router.push("/panel");
      }
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  function onSubmitForm(form: IFormValues) {
    return submit({
      email: form.email,
      password: form.password,
      type: SignInTypeEnum.EMAIL_PASSWORD,
      keepConected: form.keepConected
    })
  }

  function onSubmitGoogle(credential: any) {
    return submit({
      google: credential,
      type: SignInTypeEnum.GOOGLE,
      keepConected: getValues("keepConected")
    })
  }

  return (
    <>
      <Head>
        <title>Entrar • Systatus.Live</title>
      </Head>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => initGsi()}
      />

      {isSubmitting && <Loading />}

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Entrar</h2>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">
              <div>
                <label className="block">E-mail <span className="text-red-500">*</span></label>
                <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com" className="p-inputtext-sm" />
              </div>
              <div>
                <label className="block">Senha <span className="text-red-500">*</span></label>
                <Controller name="password" control={control} rules={{ required: true }} render={({ field }) => (
                  <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Controller name="keepConected" control={control} render={({ field }) => (
                    <Checkbox inputId={field.name} checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                  )} />
                  <label htmlFor="keepConected" className="ml-2 block text-gray-700">Manter conectado</label>
                </div>
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 text-sm">Esqueci minha senha</Link>
              </div>
              <div className="my-4">
                <Button type="submit" className="w-full">Entrar</Button>
              </div>
              <div>
                <Divider><small>Ou</small></Divider>
                <div className="flex justify-center">
                  <div id="google-signin" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm">
                <span className="text-gray-700">Não possui uma conta?{' '}</span>
                <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">Crie uma gratuitamente</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}