import { Switch } from 'antd';
import { Icon } from '../Icon';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../../store/systemSlice';
import { forwardRef, useRef, useImperativeHandle, ForwardedRef } from 'react';

interface ChildProps {
  forwardedRefs: {
    targetRef: React.RefObject<HTMLInputElement>;
  };
}

export const ThemeSwitch = forwardRef((props: ChildProps, ref: ForwardedRef<any>) => {
  const dispatch = useDispatch();
  const targetRef = useRef<HTMLInputElement>(null);

  const changeMode = (checked: boolean) => {
    if (checked) {
      dispatch(setTheme('dark'));
      document.documentElement.setAttribute('theme', 'dark');
      return;
    }
    dispatch(setTheme('light'));
    document.documentElement.setAttribute('theme', 'light');
  };

  useImperativeHandle(ref, () => ({
    targetRef,
  }));

  return (
    <div className="header-comp" style={{ lineHeight: 3 }} ref={targetRef}>
      <Switch
        checkedChildren={<Icon icon="mdi-weather-night" size={20} color="#fff" />}
        unCheckedChildren={<Icon icon="mdi-weather-sunny" size={20} color="#fff" />}
        onChange={changeMode}
      />
    </div>
  );
});
