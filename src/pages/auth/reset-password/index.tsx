"use client";

import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IFormValues = {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const { register, handleSubmit } = useForm<IFormValues>();
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

      <div className="min-h-screen bg-muted/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader className="items-center text-center">
              <Logo />
              <CardTitle className="mt-2">Redefinir Senha</CardTitle>
              <CardDescription>Crie uma nova senha para sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Senha <span className="text-destructive">*</span></FieldLabel>
                    <Input {...register("password", { required: true })} type="password" />
                  </Field>
                  <Field>
                    <FieldLabel>Confirmar Senha <span className="text-destructive">*</span></FieldLabel>
                    <Input {...register("confirmPassword", { required: true })} type="password" />
                  </Field>
                  <Button type="submit" className="w-full">Redefinir Senha</Button>
                  <FieldDescription className="text-center">
                    Cancelar redefinição?{' '}
                    <Link href="/auth/signin" className="font-medium underline-offset-4 hover:underline text-foreground">
                      Entrar
                    </Link>
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
