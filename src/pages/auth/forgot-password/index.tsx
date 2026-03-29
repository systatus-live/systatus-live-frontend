import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IFormValues = {
  email: string;
}

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormValues>();
  const [message, setMessage] = useState<string | null>(null);
  const { setLoading } = useGlobalProvider();

  function onSubmit(form: IFormValues) {
    setLoading(true);

    AuthService.forgotPassword(form.email).then((response) => {
      setIsSubmitted(true);
      setMessage(response.message);
      reset();
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    });
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
              <CardTitle className="mt-2">Esqueceu a Senha?</CardTitle>
              <CardDescription>
                Insira seu e-mail para receber um link de redefinição de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
                  >
                    <CheckIcon className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">E-mail <span className="text-destructive">*</span></FieldLabel>
                      <Input id="email" {...register("email", { required: true })} type="email" placeholder="seu@email.com" />
                    </Field>
                    <Button type="submit" className="w-full">Enviar Link</Button>
                    <FieldDescription className="text-center">
                      Lembrou a senha?{' '}
                      <Link href="/auth/signin" className="font-medium underline-offset-4 hover:underline text-foreground">
                        Entrar na sua conta
                      </Link>
                    </FieldDescription>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
