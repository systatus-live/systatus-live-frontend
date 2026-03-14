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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { control, register, handleSubmit, setValue, getValues, reset } = useForm<IFormValues>({
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

      <div className="min-h-screen bg-muted/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader className="items-center text-center">
              <Logo />
              <CardTitle className="mt-2">Criar Conta</CardTitle>
              <CardDescription>Quase lá... preencha os dados abaixo para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Nome <span className="text-destructive">*</span></FieldLabel>
                    <Input {...register("name", { required: true })} type="text" placeholder="Nome completo" />
                  </Field>
                  <Field>
                    <FieldLabel>E-mail <span className="text-destructive">*</span></FieldLabel>
                    <Input {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
                  </Field>
                  {!authFlow?.signUpSignInFlow && (
                    <>
                      <Field>
                        <FieldLabel>Senha <span className="text-destructive">*</span></FieldLabel>
                        <Input {...register("password", { required: true })} type="password" />
                      </Field>
                      <Field>
                        <FieldLabel>Confirmar Senha <span className="text-destructive">*</span></FieldLabel>
                        <Input {...register("confirmPassword", { required: true })} type="password" />
                      </Field>
                    </>
                  )}
                  <Field>
                    <FieldLabel>Onde você conheceu o Systatus.Live?</FieldLabel>
                    <Controller name="discovery" rules={{ required: false }} control={control} render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          {discoveryList.map((option) => (
                            <SelectItem key={option.id} value={option.description}>
                              {option.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )} />
                  </Field>
                  <div className="flex items-start gap-2">
                    <Controller name="acceptTerms" control={control} render={({ field }) => (
                      <Checkbox id={field.name} checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    )} />
                    <label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer leading-snug">
                      Eu aceito os{' '}
                      <Link href="/agreements/terms-of-use" target="_blank" className="font-medium underline-offset-4 hover:underline text-foreground">Termos de Uso</Link>{' '}
                      e a{' '}
                      <Link href="/agreements/privacy-policy" target="_blank" className="font-medium underline-offset-4 hover:underline text-foreground">Política de Privacidade</Link>
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <ReCAPTCHA sitekey={captchaKey} onChange={(captcha: string | null) => setValue("captcha", captcha || "")} type="image" />
                  </div>
                  <Button type="submit" className="w-full">Criar Conta</Button>
                  <FieldDescription className="text-center">
                    Já possui uma conta?{' '}
                    <Link href="/auth/signin" className="font-medium underline-offset-4 hover:underline text-foreground">Entrar</Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
