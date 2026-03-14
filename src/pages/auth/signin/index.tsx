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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      <div className="min-h-screen bg-muted/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader className="items-center text-center">
              <Logo />
              <CardTitle className="mt-2">Entrar</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">E-mail <span className="text-destructive">*</span></FieldLabel>
                      <Input id="email" {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
                    </Field>
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password">Senha <span className="text-destructive">*</span></FieldLabel>
                        <Link href="/auth/forgot-password" className="text-sm underline-offset-4 hover:underline text-muted-foreground">
                          Esqueci minha senha
                        </Link>
                      </div>
                      <Input id="password" {...register("password", { required: true })} type="password" />
                    </Field>
                    <div className="flex items-center gap-2">
                      <Controller name="keepConected" control={control} render={({ field }) => (
                        <Checkbox id={field.name} checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                      )} />
                      <label htmlFor="keepConected" className="text-sm text-muted-foreground cursor-pointer">Manter conectado</label>
                    </div>
                    <div className="flex justify-center">
                      <ReCAPTCHA sitekey={captchaKey} onChange={(captcha: string | null) => setValue("captcha", captcha || "")} type="image" />
                    </div>
                    <Button type="submit" className="w-full">Entrar</Button>
                  </FieldGroup>
                </form>
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">ou</span>
                </div>
                <div className="flex justify-center mt-4">
                  <div id="google-signin" />
                </div>
                <FieldDescription className="text-center">
                  Não possui uma conta?{' '}
                  <Link href="/auth/signup" className="font-medium underline-offset-4 hover:underline">Crie uma gratuitamente</Link>
                </FieldDescription>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
