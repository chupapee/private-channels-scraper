<h1><a href="https://t.me/private_channels_scraper_bot">🔨 Telegram private channels mediafiles scraper bot</a></h1>

<h2>⚙️ How it works?</h2>

<details>

  <summary>Initiate the userbot:</summary>
  <br/>

  ```typescript
  import { TelegramClient } from 'telegram';
  import { StoreSession } from 'telegram/sessions';

  async function main() {
    const client = await initClient();
  }

  async function initClient() {
    const storeSession = new StoreSession('userbot-session');

    const client = new TelegramClient(
      storeSession,
      USERBOT_API_ID,
      USERBOT_API_HASH,
      {
        connectionRetries: 5,
      }
    );

    await client.start({
      phoneNumber: USERBOT_PHONE_NUMBER,
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () => await input.text('Please enter the code you received: '),
      onError: (err) => console.log('error: ', err),
    });
    console.log('You should now be connected.');
    console.log(client.session.save()); // Save the session to avoid logging in again
    await client.sendMessage('me', { message: 'Hi!' });

    return client;
  }
```

</details>

• Get private message data by its link:
```typescript
const msgLink = 'https://t.me/c/1234/5678'.split('/');
const channelId = msgLink.at(-2);
const postId = msgLink.at(-1);

const channelEntity = await client.getEntity(channelId);

const privateMsgData = await client.invoke(
  new Api.channels.GetMessages({
    channel: channelEntity,
    id: [postId],
  })
);
```
• Download all private message mediafiles:
```typescript
for (const msgData of privateMsgData.messages) {
  if (msgData.media) {
    const mediaType = 'photo' in msgData.media ? 'photo' : 'video';
    const fileName = mediaType === 'photo' ? 'photo.jpg' : 'video.mp4';

    const buffer = await client.downloadMedia(msgData.media);
    if (buffer) {
      client.sendFile('me', {
        file: buffer,
        attributes: [new Api.DocumentAttributeFilename({ fileName })],
        caption: msgData.message,
      });
    }
  }
}
```

<h2>🧰 Tools Used</h2>

🤖 <a href="https://gram.js.org/">GramJS</a> 🤖 - This library serves as the backbone of the userbot component

👾 <a href="https://telegraf.js.org/">Telegraf</a> 👾 - utilized for the bot, facilitating the creation Telegram bots

☄️ <a href="https://effector.dev/">Effector</a> ☄️ - used for writing the business logic of the app, ensuring efficient state management and handling of complex workflows


<h2>🛠 Setup</h2>
<p>To run this project locally, follow these steps:</p>

- Install all dependencies
```shell
yarn
```

- Configure Credentials:

Set up your Telegram and userbot credentials in the configuration file

- Start the bot:

Launch the bot in development mode using:
```shell
yarn dev
```

- Enter Userbot Login Code:

Upon starting the bot, you'll receive a login code from Telegram. Enter this code when prompted by the userbot

- Ready to Go:

Once the bot and userbot are up and running, the Telegram Story Viewer is ready to use!

<h2>🚀 Usage</h2>
Just send a message to the bot with the desired private message link. Wait for the bot to retrieve and deliver the stories back to you
