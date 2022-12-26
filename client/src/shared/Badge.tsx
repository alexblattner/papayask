import styled from 'styled-components';
import Divider from './Divider';
import SvgIcon from './SvgIcon';
const StyledBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.primary_L2};
  color: ${(props) => props.theme.colors.primary_D1};
  cursor: pointer;
  font-weight: bold;
  gap: 12px;
  span {
    font-size: 14px;
    font-weight: normal;
    cursor: pointer;
  }
`;

interface Props {
  text: string;
  isRemovable?: boolean;
  onRemove?: (text: string) => void;
}

const Badge = (props: Props) => {
  const removeBadge = (text: string) => {
    if (!props.onRemove) {
      return;
    }
    props.onRemove(text);
  };
  return (
    <StyledBadge>
      {props.text}

      {props.isRemovable && (
        <span onClick={() => removeBadge(props.text)}>✖</span>
      )}
    </StyledBadge>
  );
};

export default Badge;
