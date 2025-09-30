"use client";

import Button from '@/components/Button';
import InputCheckBox from '@/components/InputCheckbox';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import Logo from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import AuthService from '@/services/AuthService';
import { SweetAlert } from '@/lib/sweetAlert';
import Head from 'next/head';
import InputDropdown from '@/components/InputDropdown';
import InputDropdownOption from '@/enums/InputDropdownOption';

interface IFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  discovery?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<IFormValues>();
  const [discoveryList, setDiscoveryList] = useState<InputDropdownOption[]>([]);

  useEffect(() => {
    setDiscoveryList([
      { value: "REFERRAL", label: "Indicação de amigo/colega" },
      { value: "SOCIAL", label: "Redes sociais (Instagram, Facebook, LinkedIn, etc.)" },
      { value: "AD", label: "Anúncio online (Google Ads, Facebook Ads, etc.)" },
      { value: "SEARCH", label: "Pesquisa no Google ou outro motor de busca" },
      { value: "OTHER", label: "Outros" }
    ]);
  }, []);

  function onSubmit(form: IFormValues) {
    if (!form.acceptTerms) {
      SweetAlert.info("", "Você deve aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.");
      return;
    }

    setSubmitting(true);

    AuthService.signUp({
      name: form.name,
      email: form.email,
      password: form.password,
      acceptTerms: form.acceptTerms,
      discovery: form.discovery
    }).then((_) => {
      router.push({
        pathname: "/auth/verify-account",
        query: { email: form.email }
      });
    }).catch((error) => {
      SweetAlert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <>
      <Head>
        <title>Cadastrar • Systatus.Live</title>
      </Head>
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
                <InputText {...register("name", { required: true })} type="text" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail <span className="text-red-500">*</span></label>
                <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha <span className="text-red-500">*</span></label>
                <InputPassword {...register("password", { required: true })} placeholder="********" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Senha <span className="text-red-500">*</span></label>
                <InputPassword {...register("confirmPassword", { required: true })} placeholder="********" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Onde você conheceu o Systatus.Live?</label>
                <InputDropdown options={discoveryList} {...register("discovery")} />
              </div>
              <div className="flex items-center">
                <InputCheckBox {...register("acceptTerms")} />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  Eu aceito os {' '}
                  <Link href="/agreements/terms-of-use" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Termos de Uso</Link>{' '}
                  e a{' '}
                  <Link href="/agreements/privacy-policy" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Política de Privacidade</Link>
                </label>
              </div>
              <div className="my-4">
                {isSubmitting}
                <Button severity="secondary" type="submit" className="w-full" disabled={isSubmitting}>Criar Conta</Button>
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
    </>
  )
}
