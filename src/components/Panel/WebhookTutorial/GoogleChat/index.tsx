import Image from "next/image";
import Link from "next/link";

export default function GoogleChatWebhookTutorial() {
  return (
    <div>
      <div>
        <p className="mb-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 1: </b>Acesse as configurações <b>"Apps & Integrações"</b> do espaço:</p>
        <Image src="/images/tutorial/google-chat/1.png" alt="." width={0} height={0} style={{ width: "15rem", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 2: </b>Clique em <b>"Adicionar webhooks"</b>:</p>
        <Image src="/images/tutorial/google-chat/2.png" alt="." width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 3: </b>Defina um nome e avatar (opcional) do webhook e clique em <b>"Salvar"</b>:</p>
        <Image src="/images/tutorial/google-chat/3.png" alt="." width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 4:</b> Copie a URL do Webhook e use ela no Systatus.Live para receber notificações no canal:</p>
        <Image src="/images/tutorial/google-chat/4.png" alt="." width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm">
          <b>Dúvidas ao criar o Webhook? </b>
          Acesse a <a href="https://developers.google.com/workspace/chat/quickstart/webhooks?hl=pt-br" target="_blank" className="text-blue-500">documentação oficial do Google Chat </a>
          ou entre em contato com a gente pelo <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500" target="_blank">formulário de contato</Link>.
        </p>
      </div>
    </div>
  )
}