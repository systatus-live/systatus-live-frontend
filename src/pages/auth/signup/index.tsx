import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import AuthService from '@/services/AuthService';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from 'react-hook-form';
import styles from "./styles.module.css";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';

type IFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  discovery?: string;
  captcha: string;
}

export default function SignUp() {
  const router = useRouter();
  const { authFlowId, keepConected } = router.query;
  const [authFlow, setAuthFlow] = useState<any>();
  const { control, register, handleSubmit, setValue, watch, getValues, reset } = useForm<IFormValues>({
    values: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      captcha: "",
    }
  });
  const [discoveryList, setDiscoveryList] = useState<{ id: string, description: string }[]>([]);
  const captchaKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_CLIENT_ID!;
  const { setLoading } = useGlobalProvider();

  useEffect(() => {
    setDiscoveryList([
      { id: "REFERRAL", description: "Indicação de amigo/colega" },
      { id: "SOCIAL", description: "Redes sociais (Instagram, Facebook, LinkedIn, etc.)" },
      { id: "AD", description: "Anúncio online (Google Ads, Facebook Ads, etc.)" },
      { id: "SEARCH", description: "Pesquisa no Google ou outro motor de busca" },
      { id: "OTHER", description: "Outros" }
    ]);
  }, []);

  useEffect(() => {
    if (authFlowId) {
      getAuthFlow();
    }
  }, [authFlowId]);

  function onSubmit(form: IFormValues) {
    if (!getValues("acceptTerms")) {
      Alert.info("Termos", "Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    if (!getValues("captcha")) {
      Alert.info("Não sou um robô", "Resolva o reCAPTCHA para continuar.");
      return;
    }

    setLoading(true);

    const headers = {
      captcha: form.captcha
    }

    AuthService.signUp({
      name: form.name,
      email: form.email,
      password: form.password,
      acceptTerms: form.acceptTerms,
      discovery: form.discovery
    }, headers).then((_) => {
      router.push({
        pathname: "/auth/verify-account",
        query: {
          authFlowId: authFlowId,
          keepConected: keepConected == "true"
        }
      });
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    })
  }

  async function getAuthFlow() {
    setLoading(true);

    try {
      const response = await AuthService.getAuthFlowId(authFlowId as string);
      setAuthFlow(response);
      reset({
        name: response.name,
        email: response.email
      })
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
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
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Criar Conta </h2>
            <h2 className={`my-6 text-1xl  ${styles["title"]}`}>Quase lá... ✨✨🚀</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Field>
                <FieldLabel>Nome <span className="text-red-500">*</span></FieldLabel>
                <Input {...register("name", { required: true })} type="text" placeholder="Nome completo" />
              </Field>
              <Field>
                <FieldLabel>E-mail <span className="text-red-500">*</span></FieldLabel>
                <Input {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
              </Field>
              {!authFlow?.signUpSignInFlow ?
                <>
                  <Field>
                    <FieldLabel>Senha <span className="text-red-500">*</span></FieldLabel>
                    <Input {...register("password", { required: true })} type="password" />
                  </Field>
                  <Field>
                    <FieldLabel>Confirmar Senha <span className="text-red-500">*</span></FieldLabel>
                    <Input {...register("confirmPassword", { required: true })} type="password" />
                  </Field>
                </> : <></>
              }
              <Field>
                <FieldLabel>Onde você conheceu o Systatus.Live?</FieldLabel>
                <Controller name="discovery" rules={{ required: false }} control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {discoveryList.map((option) => (
                        <SelectItem key={option.description} value={option.description}>
                          {option.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </Field>
              <div className="flex items-center">
                <Controller name="acceptTerms" control={control} render={({ field }) => (
                  <Checkbox id={field.name} checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                )} />
                <p className="text-sm ml-2 block cursor-pointer">
                  Eu aceito os {' '}
                  <Link href="/agreements/terms-of-use" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Termos de Uso</Link>{' '}
                  e a{' '}
                  <Link href="/agreements/privacy-policy" target="_blank" className="font-medium text-blue-600 hover:text-blue-500">Política de Privacidade</Link>
                </p>
              </div>
              <div className="my-4">
                <Button type="submit" className="w-full">Criar Conta</Button>
              </div>
              <div>
                <div className="flex justify-center">
                  <ReCAPTCHA sitekey={captchaKey} onChange={(captcha: string | null) => setValue("captcha", captcha || "")} type="image" />
                </div>
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
