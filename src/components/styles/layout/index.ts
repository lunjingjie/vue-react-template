import { styled } from 'styled-components';

type justifyContent = 'space-around' | 'space-between' | 'flex-start' | 'flex-end' | 'center';
type DirectionType = 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'initial' | 'inherit';

interface IFlexWrap {
  direction?: DirectionType;
  justifyContent?: justifyContent;
}

export const FlexWrap = styled.div<IFlexWrap>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: ${(props) => props.justifyContent || 'space-around'};
`;
