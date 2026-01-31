"use client";

import Logo from '@/components/Logo';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import AuthService from '@/services/AuthService';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import styles from "./styles.module.scss";

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

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-center">
                <Logo />
              </div>
              <h2 className={`my-6 text-center text-2xl  ${styles["title"]}`}>Insira o código</h2>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Insira o <strong>código de verificação</strong> enviado para seu e-mail{authFlow && (<strong>{` ${authFlow.email}`}</strong>)}.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                {isClient && (
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span className="mx-1"></span>}
                    renderInput={(props) => <InputText {...props as any} />}
                    skipDefaultStyles={true}
                  />
                )}
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Verifique o spam ou lixeira, ou <span onClick={() => sendCode()} className="cursor-pointer text-blue-500 font-medium">clique aqui</span> para reenviar{timer > 0 && <i> (aguarde {timer}s)</i>}.
              </p>
              <div className="my-4">
                <Button type="submit" className="w-full">Enviar Código</Button>
              </div>
              <p className="mt-2 text-center text-sm text-gray-600">
                Lembrou a senha?{' '}
                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Entrar na sua conta
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
