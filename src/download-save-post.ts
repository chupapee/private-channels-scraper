import { Userbot } from 'config/userbot';
import { Api } from 'telegram';

interface DownloadAndSaveParams {
  channelId: string;
  postId: number;
}

export async function downloadAndSavePost({
  channelId,
  postId,
}: DownloadAndSaveParams) {
  const client = await Userbot.getInstance();
  const channelEntity = await client.getEntity(channelId);

  const privateMsgData = await client.invoke(
    new Api.channels.GetMessages({
      channel: channelEntity,
      id: [postId as any],
    })
  );

  if ('messages' in privateMsgData) {
    let count = 0;
    for (const msg of privateMsgData.messages) {
      if ('media' in msg && msg.media !== undefined) {
        const mediaType = 'photo' in msg.media ? 'photo' : 'video';
        const fileName = mediaType === 'photo' ? 'photo.jpg' : 'video.mp4';

        const buffer = await client.downloadMedia(msg.media);
        if (buffer) {
          client.sendFile('me', {
            file: buffer,
            attributes: [new Api.DocumentAttributeFilename({ fileName })],
            caption: count === 0 ? msg.message : '',
            forceDocument: false,
            supportsStreaming: false,
            fileSize: buffer.length,
          });
        }
        count++;
      }
    }
  }
}
