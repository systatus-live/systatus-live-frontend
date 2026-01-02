import Image from "next/image";
import Link from "next/link";

export default function DiscordWebhookTutorial() {
  return (
    <div>
      <div>
        <p className="mb-6 bg-gray-200 rounded-lg p-2"><b>Passo 1: </b>Abra as <b>Configurações do Servidor</b>:</p>
        <Image src="/images/tutorial/discord/1.png" alt="" width={0} height={0} style={{ width: "20rem", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2"><b>Passo 2: </b>Acesse a aba <b>Integrações</b>, defina o nome e canal de notificações e clique em <b>Criar Webhook</b>:</p>
        <Image src="/images/tutorial/discord/2.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2"><b>Passo 3: </b> Copie a URL do Webhook e use ela no Systatus.Live para receber notificações no canal:</p>
        <Image src="/images/tutorial/discord/3.png" alt="" width={0} height={0} style={{ width: "100%", height: "auto" }} sizes="100%" className="rounded-lg" />
      </div>
      <div>
        <p className="my-6 bg-gray-200 rounded-lg p-2">
          <b>Dúvidas ao criar o Webhook? </b>
          Acesse a <a href="https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks" target="_blank" className="text-blue-500">documentação oficial do Discord </a>  
          ou entre em contato com a gente pelo <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500" target="_blank">formulário de contato</Link>.
        </p>
      </div>
    </div>
  )
}