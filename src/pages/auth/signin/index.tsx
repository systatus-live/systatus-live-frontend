import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import AuthService from '@/services/AuthService';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';
import styles from "./styles.module.css";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Field, FieldLabel } from '@/components/ui/field';

type IFormValues = {
  email: string;
  password: string;
  type: SignInTypeEnum | null,
  keepConected: boolean,
  captcha: string | null;
}

export default function SignIn() {
  const router = useRouter();
  const { setLoading } = useGlobalProvider();
  const { control, register, handleSubmit, getValues, setValue } = useForm<IFormValues>({
    values: {
      email: "",
      password: "",
      type: null,
      keepConected: false,
      captcha: null
    }
  });
  const captchaKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_CLIENT_ID!;

  useEffect(() => {
    setLoading(false);
    
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

  function submit(form: SignInOptionsDTO, captcha: string | null) {
    setLoading(true);

    const headers = {
      captcha: captcha
    }

    AuthService.signInLocal(form, headers).then(async (response) => {
      if (response.signUpSignInFlow) {
        router.push({
          pathname: "/auth/signup",
          query: {
            authFlowId: response.authFlowId,
            keepConected: form.keepConected
          }
        }).finally(() => setLoading(false));;
      } else {
        router.push("/panel").finally(() => setLoading(false));
      }
    }).catch((error) => {
      Alert.error("", error.message);
      setLoading(false);
    })
  }

  function onSubmitForm(form: IFormValues) {
    if (!getValues("captcha")) {
      Alert.info("Não sou um robô", "Resolva o reCAPTCHA para continuar.");
      return;
    }

    return submit({
      email: form.email,
      password: form.password,
      type: SignInTypeEnum.EMAIL_PASSWORD,
      keepConected: form.keepConected
    }, form.captcha)
  }

  function onSubmitGoogle(credential: any) {
    return submit({
      google: credential,
      type: SignInTypeEnum.GOOGLE,
      keepConected: getValues("keepConected")
    }, null)
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

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Entrar</h2>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">
              <Field>
                <FieldLabel>E-mail <span className="text-red-500">*</span></FieldLabel>
                <Input {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
              </Field>
              <Field>
                <FieldLabel>Senha <span className="text-red-500">*</span></FieldLabel>
                <Input {...register("password", { required: true })} type="password" />
              </Field>
              <div className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Controller name="keepConected" control={control} render={({ field }) => (
                    <Checkbox id={field.name} checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  )} />
                  <label htmlFor="keepConected" className="ml-2 block text-gray-700 cursor-pointer">Manter conectado</label>
                </div>
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 text-sm">Esqueci minha senha</Link>
              </div>
              <div className="flex justify-center">
                <ReCAPTCHA sitekey={captchaKey} onChange={(captcha: string | null) => setValue("captcha", captcha || "")} type="image" />
              </div>
              <div className="my-4">
                <Button type="submit" className="w-full">Entrar</Button>
              </div>
              <div>
                <Separator />
                <div className="flex justify-center mt-4">
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