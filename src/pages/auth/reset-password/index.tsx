"use client";

import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import AuthService from '@/services/AuthService';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Controller, useForm } from 'react-hook-form';
import styles from "./styles.module.scss";

type IFormValues =  {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const { control, handleSubmit } = useForm<IFormValues>();
  const { setLoading } = useGlobalProvider();

  function onSubmit(form: IFormValues) {
    setLoading(true);

    AuthService.resetPassword(form.password, token as string).then((response: any) => {
      router.push({
        pathname: "/auth/signin"
      });
      Alert.success("", response.message);
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
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
                <label className="block text-sm">Senha <span className="text-red-500">*</span></label>
                <Controller name="password" control={control} rules={{ required: true }} render={({ field }) => (
                  <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
                )} />
              </div>
              <div>
                <label className="block text-sm">Confirmar Senha <span className="text-red-500">*</span></label>
                <Controller name="confirmPassword" control={control} rules={{ required: true }} render={({ field }) => (
                  <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
                )} />
              </div>
              <div className="my-4">
                <Button type="submit" className="w-full">Redefinir Senha</Button>
              </div>
              <p className="mt-2 text-center text-sm">
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
