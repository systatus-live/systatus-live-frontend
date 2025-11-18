"use client";

import { Button } from 'primereact/button';
import InputCheckBox from '@/components/InputCheckbox';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from "./styles.module.scss";
import AuthService from '@/services/AuthService';
import { Alert } from '@/lib/Alert';
import Head from 'next/head';
import Loading from '@/components/Loading';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';

type IFormValues = {
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
  const { control, register, handleSubmit, setValue, getValues } = useForm<IFormValues>();
  const [discoveryList, setDiscoveryList] = useState<{ id: string, description: string }[]>([]);
  const [discovery, setDiscovery] = useState(null);

  useEffect(() => {
    setDiscoveryList([
      { id: "REFERRAL", description: "Indicação de amigo/colega" },
      { id: "SOCIAL", description: "Redes sociais (Instagram, Facebook, LinkedIn, etc.)" },
      { id: "AD", description: "Anúncio online (Google Ads, Facebook Ads, etc.)" },
      { id: "SEARCH", description: "Pesquisa no Google ou outro motor de busca" },
      { id: "OTHER", description: "Outros" }
    ]);
  }, []);

  function onSubmit(form: IFormValues) {
    if (!form.acceptTerms) {
      Alert.info("", "Você deve aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.");
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
      Alert.error("", error.message);
    }).finally(() => {
      setSubmitting(false);
    })
  }

  return (
    <>
      <Head>
        <title>Cadastrar • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Criar Conta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm">Nome <span className="text-red-500">*</span></label>
                <InputText {...register("name", { required: true })} type="text" placeholder="Nome completo" className="p-inputtext-sm" />
              </div>
              <div>
                <label className="block text-sm">E-mail <span className="text-red-500">*</span></label>
                <InputText {...register("email", { required: true })} type="email" placeholder="seu@email.com" className="p-inputtext-sm" />
              </div>
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
              <div>
                <label className="block text-sm">Onde você conheceu o Systatus.Live?</label>
                <Dropdown
                  {...register("discovery")}
                  options={discoveryList}
                  checkmark={true}
                  showClear={true}
                  optionValue="id"
                  optionLabel="description"
                  onChange={(e) => {
                    setDiscovery(e.value);
                    setValue("discovery", e.value);
                  }}
                  value={discovery}
                />
              </div>
              <div className="flex items-center">
                <InputCheckBox {...register("acceptTerms")} />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm">
                  Eu aceito os {' '}
                  <Link href="/agreements/terms-of-use" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Termos de Uso</Link>{' '}
                  e a{' '}
                  <Link href="/agreements/privacy-policy" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Política de Privacidade</Link>
                </label>
              </div>
              <div className="my-4">
                {isSubmitting}
                <Button type="submit" className="w-full">Criar Conta</Button>
              </div>
              <p className="mt-2 text-center text-sm">
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
