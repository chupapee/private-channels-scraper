import { config } from 'dotenv';

const { parsed } = config();

export const getEnvVar = (key: string) => {
  if (process.env[key] === undefined || parsed?.[key] === undefined) {
    throw new Error(`Env variable ${key} is required`);
  }
  return process.env[key] || parsed[key] || '';
};

/** Runtime mode */
export const NODE_ENV = getEnvVar('NODE_ENV');
/** Dev mode */
export const isDevEnv = NODE_ENV === 'development';
/** Prod mode */
export const isProdEnv = NODE_ENV === 'production';

/** bot's token */
export const BOT_TOKEN = isDevEnv
  ? getEnvVar('DEV_BOT_TOKEN')
  : getEnvVar('PROD_BOT_TOKEN');

// userbot
export const USERBOT_API_ID = Number(getEnvVar('USERBOT_API_ID'));
export const USERBOT_API_HASH = getEnvVar('USERBOT_API_HASH');
export const USERBOT_PHONE_NUMBER = getEnvVar('USERBOT_PHONE_NUMBER');

export const BOT_ADMIN_ID = Number(getEnvVar('BOT_ADMIN_ID'));
export const BOT_ADMIN_USERNAME = getEnvVar('BOT_ADMIN_USERNAME');
