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
import AuthService from '@/services/AuthService';
import { SweetAlert } from '@/lib/sweetAlert';
import { SignInTypeEnum } from '@/enums/SignInTypeEnum';

interface IFormValues {
  email: string;
  password: string;
  type: SignInTypeEnum
}

export default function SignIn() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormValues>();

  function onSubmit(form: IFormValues) {
    setSubmitting(true);

    AuthService.signIn({
      email: form.email,
      password: form.password,
      type: SignInTypeEnum.EMAIL_PASSWORD
    }).then((_) => {
      router.push("/panel");
    }).catch((error) => {
      SweetAlert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></label>
              <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha <span className="text-red-500">*</span></label>
              <InputPassword {...register("password", { required: true })} placeholder="********" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <InputCheckBox />
                <label className="ml-2 block text-sm text-gray-900">
                  Manter conectado
                </label>
              </div>
              <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                Esqueci minha senha
              </Link>
            </div>
            <div className="my-4">
              <Button severity="secondary" type="submit" className="w-full">Entrar</Button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Não possui uma conta?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Crie uma gratuitamente
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
