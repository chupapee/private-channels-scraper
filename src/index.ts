import { IContextBot } from 'config/context-interface';
import { BOT_ADMIN_ID, BOT_ADMIN_USERNAME, BOT_TOKEN } from 'config/env-config';
import { i18n } from 'config/i18n';
import { initUserbot } from 'config/userbot';
import { downloadAndSavePost } from 'download-save-post';
import { createEvent, createStore } from 'effector';
import { session, Telegraf } from 'telegraf';
import { callbackQuery, message } from 'telegraf/filters';

export const bot = new Telegraf<IContextBot>(BOT_TOKEN);

bot.use(session());
bot.use(i18n.middleware());

bot.catch((error) => {
  console.error(error, 'INDEX.TS');
});

bot.use((ctx, next) => {
  if (ctx.from?.id !== BOT_ADMIN_ID) {
    return ctx.reply(ctx.i18n.t('personalAccess'));
  }

  return next();
});

bot.start(async (ctx) => {
  await ctx.reply(ctx.i18n.t('linkExample'));
});

const $isSending = createStore(false);
const sendingStarted = createEvent();
const sendingFinished = createEvent();
$isSending.on(sendingStarted, () => true);
$isSending.on(sendingFinished, () => false);
const RESTART_COMMAND = 'restart';

const extraOptions: any = {
  link_preview_options: {
    is_disabled: true,
  },
};

bot.on(message('text'), async (ctx) => {
  const handleMessage = async () => {
    let text = ctx.message.text;

    if ($isSending.getState()) {
      return ctx.reply(ctx.i18n.t('sendingLink'));
    }

    if (text.startsWith('https://telesco.pe/')) {
      text = text.replace('telesco.pe', 't.me');
    }

    if (text.startsWith('https://t.me/')) {
      await ctx.reply(ctx.i18n.t('processingLink'));
      const splittedText = text.split('/');
      const postId = Number(splittedText.at(-1)?.replace('?single', ''));
      const channel = splittedText.at(-2);
      const isPrivate = !Number.isNaN(Number(channel));
      const channelId = isPrivate ? '-100' + BigInt(channel!) : channel!;

      sendingStarted();
      await downloadAndSavePost({ channelId, postId });

      await ctx.reply(
        ctx.i18n.t('storedInSaved') + `(https://t.me/${BOT_ADMIN_USERNAME})`,
        {
          ...extraOptions,
          parse_mode: 'MarkdownV2',
        }
      );
      sendingFinished();

      return;
    }

    // restart action
    if (ctx.from.id === BOT_ADMIN_ID && ctx.message.text === RESTART_COMMAND) {
      ctx.reply(ctx.i18n.t('approveRestart'), {
        reply_markup: {
          inline_keyboard: [
            [{ text: ctx.i18n.t('yes'), callback_data: RESTART_COMMAND }],
          ],
        },
      });
      return;
    }

    ctx.reply(ctx.i18n.t('wrongLink'));
  };

  handleMessage();
});

bot.on(callbackQuery('data'), async (ctx) => {
  if (ctx.callbackQuery.data === RESTART_COMMAND) {
    await ctx.answerCbQuery(ctx.i18n.t('restartingBot'));
    process.exit();
  }
});

bot.launch({ dropPendingUpdates: true });
initUserbot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
