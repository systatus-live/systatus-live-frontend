export enum ChatPlatformTypeEnum {
  WEBHOOK = "WEBHOOK",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

/**
 * Mapeamento pelo campo `name` da entidade (ex.: platform.name = "SLACK")
 * Usado no select de plataformas (create/edit).
 */
export const ChatPlatformNameLogoMap: Record<string, string> = {
  SLACK: "/logos/slack.svg",
  GOOGLE_CHAT: "/logos/google-chat.svg",
  DISCORD: "/logos/discord.svg",
  EMAIL: "/logos/mail.svg",
  WHATSAPP: "/logos/whatsapp.svg",
};

/**
 * Mapeamento pelo campo `description` da entidade (ex.: integration.chatPlatform = "Slack")
 * Usado na listagem de integrações.
 */
export const ChatPlatformDescriptionLogoMap: Record<string, string> = {
  "Slack": "/logos/slack.svg",
  "Google Chat": "/logos/google-chat.svg",
  "Discord": "/logos/discord.svg",
  "E-mail": "/logos/mail.svg",
  "WhatsApp": "/logos/whatsapp.svg",
};
