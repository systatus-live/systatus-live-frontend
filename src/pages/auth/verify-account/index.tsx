"use client";

import Logo from "@/components/Logo";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import AuthService from "@/services/AuthService";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IFormValues = {
  code: string;
}

export default function VerifyAccount() {
  const router = useRouter();
  const { authFlowId, keepConected } = router.query;
  const [authFlow, setAuthFlow] = useState<any>();
  const [isClient, setIsClient] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState<number>(0);
  const { handleSubmit } = useForm<IFormValues>();
  const { setLoading } = useGlobalProvider();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (authFlowId) {
      getAuthFlow();
    }
  }, [authFlowId]);

  function onSubmit(_: IFormValues) {
    setLoading(true);

    AuthService.checkCodeLocal({ code: otp, keepConected: keepConected == "true" }).then(_ => {
      router.push("/panel");
    }).catch((error) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    })
  }

  async function sendCode() {
    if (timer > 0) return;

    setLoading(true);

    AuthService.sendCode(authFlow.email).then((response: any) => {
      Alert.success("", response.message);

      let seconds = 30;
      setTimer(seconds);
      const interval = setInterval(() => {
        setTimer(seconds -= 1);
        if (seconds == -1) clearInterval(interval);
      }, 1000);
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
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Verificar Conta • Systatus.Live</title>
      </Head>

      <div className="min-h-screen bg-muted/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardHeader className="items-center text-center">
              <Logo />
              <CardTitle className="mt-2">Insira o código</CardTitle>
              <CardDescription>
                Código de verificação enviado para{authFlow ? <strong>{` ${authFlow.email}`}</strong> : ' seu e-mail'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <div className="flex justify-center">
                    {isClient && (
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span className="mx-1" />}
                        renderInput={(props) => <Input {...props as any} />}
                        skipDefaultStyles={true}
                      />
                    )}
                  </div>
                  <FieldDescription className="text-center">
                    Verifique o spam ou lixeira, ou{' '}
                    <span
                      onClick={() => sendCode()}
                      className={`font-medium underline-offset-4 hover:underline text-foreground ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      clique aqui para reenviar
                    </span>
                    {timer > 0 && <i> (aguarde {timer}s)</i>}
                  </FieldDescription>
                  <Button type="submit" className="w-full">Verificar Conta</Button>
                  <FieldDescription className="text-center">
                    Lembrou a senha?{' '}
                    <Link href="/auth/signin" className="font-medium underline-offset-4 hover:underline text-foreground">
                      Entrar na sua conta
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
