import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Tab = "slack" | "google-chat" | "discord";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "slack", label: "Slack", icon: "/logos/slack.svg" },
  { id: "google-chat", label: "Google Chat", icon: "/logos/google-chat.svg" },
  { id: "discord", label: "Discord", icon: "/logos/discord.svg" },
];

function Step({ step, text }: { step: number; text: string }) {
  return (
    <p className="rounded-lg bg-muted p-2.5 text-sm">
      <b>Passo {step}: </b>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </p>
  );
}

function TutorialImage({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={0}
      height={0}
      style={{ width: "100%", height: "auto" }}
      sizes="100%"
      className="rounded-lg"
    />
  );
}

function DocsNote({ href, label }: { href: string; label: string }) {
  return (
    <p className="rounded-lg bg-muted p-2.5 text-sm">
      <b>Dúvidas ao criar o Webhook? </b>
      Acesse a{" "}
      <a href={href} target="_blank" className="text-primary underline underline-offset-4">
        {label}
      </a>{" "}
      ou entre em contato pelo{" "}
      <Link href="/contact" target="_blank" className="text-primary underline underline-offset-4">
        formulário de contato
      </Link>
      .
    </p>
  );
}

function SlackTutorial() {
  return (
    <div className="space-y-4">
      <Step step={1} text='Acesse <a class="text-primary underline underline-offset-4" href="https://api.slack.com/apps" target="_blank">https://api.slack.com/apps</a> autenticado e clique em <b>"Create an App"</b>:' />
      <TutorialImage src="/images/tutorial/slack/1.png" />
      <Step step={2} text='Crie um app a partir da opção <b>"From scratch"</b>:' />
      <TutorialImage src="/images/tutorial/slack/2.png" />
      <Step step={3} text='Defina um nome e o workspace. Após isso, clique em <b>"Create App"</b>:' />
      <TutorialImage src="/images/tutorial/slack/3.png" />
      <Step step={4} text='Acesse a aba <b>"Incoming Webhooks"</b> e habilite os webhooks:' />
      <TutorialImage src="/images/tutorial/slack/4.png" />
      <Step step={5} text='Clique em <b>"Add New Webhook"</b>:' />
      <TutorialImage src="/images/tutorial/slack/5.png" />
      <Step step={6} text='Confirme o workspace e o canal e clique em <b>"Permitir"</b>:' />
      <TutorialImage src="/images/tutorial/slack/6.png" />
      <Step step={7} text="Copie a URL do Webhook e use ela no Systatus.Live:" />
      <TutorialImage src="/images/tutorial/slack/7.png" />
      <DocsNote href="https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/" label="documentação oficial do Slack" />
    </div>
  );
}

function GoogleChatTutorial() {
  return (
    <div className="space-y-4">
      <Step step={1} text='Acesse as configurações <b>"Apps & Integrações"</b> do espaço:' />
      <TutorialImage src="/images/tutorial/google-chat/1.png" />
      <Step step={2} text='Clique em <b>"Adicionar webhooks"</b>:' />
      <TutorialImage src="/images/tutorial/google-chat/2.png" />
      <Step step={3} text='Defina um nome e avatar (opcional) e clique em <b>"Salvar"</b>:' />
      <TutorialImage src="/images/tutorial/google-chat/3.png" />
      <Step step={4} text="Copie a URL do Webhook e use ela no Systatus.Live:" />
      <TutorialImage src="/images/tutorial/google-chat/4.png" />
      <DocsNote href="https://developers.google.com/workspace/chat/quickstart/webhooks?hl=pt-br" label="documentação oficial do Google Chat" />
    </div>
  );
}

function DiscordTutorial() {
  return (
    <div className="space-y-4">
      <Step step={1} text='Abra as <b>Configurações do Servidor</b>:' />
      <TutorialImage src="/images/tutorial/discord/1.png" />
      <Step step={2} text='Acesse a aba <b>Integrações</b> e clique em <b>Criar Webhook</b>:' />
      <TutorialImage src="/images/tutorial/discord/2.png" />
      <Step step={3} text="Defina um nome e avatar (opcional). Copie a URL do Webhook e use ela no Systatus.Live:" />
      <TutorialImage src="/images/tutorial/discord/3.png" />
      <DocsNote href="https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks" label="documentação oficial do Discord" />
    </div>
  );
}

export default function WebhookTutorial() {
  const [active, setActive] = useState<Tab>("slack");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex gap-1 border-b px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 transition-colors -mb-px ${
              active === tab.id
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image src={tab.icon} alt="" width={14} height={14} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="overflow-y-auto flex-1 min-h-0 px-4 py-4">
        {active === "slack" && <SlackTutorial />}
        {active === "google-chat" && <GoogleChatTutorial />}
        {active === "discord" && <DiscordTutorial />}
      </div>
    </div>
  );
}
