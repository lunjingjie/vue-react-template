import { getAppEnvConfig } from '../../utils/env';

export const useGlobSetting = () => {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_APP_SHORT_NAME, SECRET_KEY } = getAppEnvConfig();

  return {
    title: VITE_GLOB_APP_TITLE,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    secretKey: SECRET_KEY,
  };
};
