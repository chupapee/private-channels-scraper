import { IContextBot } from 'config/context-interface';
import { BOT_ADMIN_ID, BOT_TOKEN } from 'config/env-config';
import { initUserbot } from 'config/userbot';
import { session, Telegraf } from 'telegraf';
import { callbackQuery, message } from 'telegraf/filters';

export const bot = new Telegraf<IContextBot>(BOT_TOKEN);

bot.use(session());

bot.catch((error) => {
  console.error(error, 'INDEX.TS');
});

bot.on(message('text'), async (ctx) => {
  const handleMessage = async () => {
    let text = ctx.message.text;

  };

  handleMessage();
});

bot.launch({ dropPendingUpdates: true });
initUserbot();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
