import { Layout } from 'antd';
import { SysFooter } from '../SysFooter';
import { FlexWrap } from '../../styles';
import { ProgressRouter } from '../ProgressRouter';
const { Content } = Layout;

export const SysContent: React.FC = () => {
  return (
    <Content
      style={{
        margin: 3,
        minHeight: 280,
      }}
      className="layout-content"
    >
      <ProgressRouter></ProgressRouter>
      <FlexWrap>
        <SysFooter />
      </FlexWrap>
    </Content>
  );
};
