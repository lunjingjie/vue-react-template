import { useState } from 'react';
/**
 * 主题切换
 */
export const useThemeSwitch = () => {
	const [theme, setTheme] = useState<string>('light');

  return {
    theme,
    setTheme,
  }
};
