import { TabView, TabPanel } from 'primereact/tabview';
import Image from 'next/image';
import SlackWebhookTutorial from './Slack';
import GoogleChatWebhookTutorial from './GoogleChat';
import DiscordWebhookTutorial from './Discord';

export default function WebhookTutorial() {

  return (
    <div>
      <TabView>
        <TabPanel header={
          <div className="flex items-center space-x-2">
            <Image src="/logos/slack.svg" alt="" width={18} height={18} />
            <b>Slack</b>
          </div>
        }>
          <div className="mt-3">
            <SlackWebhookTutorial />
          </div>
        </TabPanel>
        <TabPanel header={
          <div className="flex items-center space-x-2">
            <Image src="/logos/google-chat.svg" alt="" width={18} height={18} />
            <b>Google Chat</b>
          </div>
        }>
          <div className="mt-3">
            <GoogleChatWebhookTutorial />
          </div>
        </TabPanel>
        <TabPanel header={
          <div className="flex items-center space-x-2">
            <Image src="/logos/discord.svg" alt="" width={18} height={18} />
            <b>Discord</b>
          </div>
        }>
          <div className="mt-3">
            <DiscordWebhookTutorial />
          </div>
        </TabPanel>
      </TabView>
    </div>
  )
}