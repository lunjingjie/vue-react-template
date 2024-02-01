export const getConfigFileName = (env) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
};

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);
  const ENV = import.meta.env.DEV ? import.meta.env : window[ENV_NAME];

  const { VITE_GLOB_APP_TITLE, VITE_GLOB_APP_SHORT_NAME, SECRET_KEY } = ENV;

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    SECRET_KEY,
  };
}
