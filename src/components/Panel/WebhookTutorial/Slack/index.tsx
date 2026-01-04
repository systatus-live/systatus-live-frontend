import Image from "next/image";
import Link from "next/link";

export default function SlackWebhookTutorial() {
  return (
    <div>
      <div>
        <p className="mb-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 1: </b>Acesse <a className="text-blue-500" href="https://api.slack.com/apps" target="_blank">https://api.slack.com/apps</a> autenticado e clique em <b>"Create an App"</b>:</p>
        <Image src="/images/tutorial/slack/1.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 2: </b>Crie um app a partir da opção <b>"From scratch"</b>:</p>
        <Image src="/images/tutorial/slack/2.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 3: </b>Defina um nome e o workspace que o app será criado. Após isso, clique em <b>"Create App"</b>:</p>
        <Image src="/images/tutorial/slack/3.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 4: </b>Na tela aberta, acesse a aba <b>"Incoming Webhooks"</b> e habilite os webhooks para o novo app:</p>
        <Image src="/images/tutorial/slack/4.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 5: </b>Clique em <b>"Add New Webhook"</b>:</p>
        <Image src="/images/tutorial/slack/5.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 6: </b>Confirme o workspace e o canal de notificações do webhook e clique em <b>"Permitir"</b>:</p>
        <Image src="/images/tutorial/slack/6.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm"><b>Passo 7:</b> Copie a URL do Webhook e use ela no Systatus.Live para receber notificações no canal:</p>
        <Image src="/images/tutorial/slack/7.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2 text-sm">
          <b>Dúvidas ao criar o Webhook? </b>
          Acesse a <a href="https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/" target="_blank" className="text-blue-500">documentação oficial do Slack </a>
          ou entre em contato com a gente pelo <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500" target="_blank">formulário de contato</Link>.
        </p>
      </div>
    </div>
  )
}