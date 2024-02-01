import styled from 'styled-components';
import { Icon } from '../Icon';
import { Tour } from 'antd';
import { useState } from 'react';
import type { TourProps } from 'antd';

const Text = styled.span`
  padding-left: 3px;
  color: #697b8c;
  font-size: 14px;
`;

type propsType = {
  siderRef?: any;
  themeRef?: any;
};

export const UserGuide: React.FC<propsType> = (props: propsType) => {
  const [open, setOpen] = useState<boolean>(false);

  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => props.themeRef.current?.targetRef.current,
    },
    // {
    //   title: 'Save',
    //   description: 'Save your changes.',
    //   // target: () => props.themeRef,
    // },
    // {
    //   title: 'Other Actions',
    //   description: 'Click to see other actions.',
    //   // target: () => props.siderRef,
    // },
  ];

  return (
    <>
      <div className="header-comp" onClick={() => setOpen(true)}>
        <Icon icon="mdi-help-circle-outline" size={14} />
        <Text>新手引导</Text>
      </div>

      <Tour open={open} onClose={() => setOpen(false)} mask={false} type="primary" steps={steps} />
    </>
  );
};
