import React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import styled from 'styled-components';

const Container = styled.div`
  height: 30px;
  min-width: 190px;
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #a0a0a0;
`;

interface Props {
  style?: any;
  onClick?: ()=>void;
  children?: React.ReactNode;
}

const Button: React.FC<Props> = ({ children, style, onClick}) => {
  return (
    <div>
      <ButtonBase onClick={onClick}>
        <Container style={style}>{children}</Container>
      </ButtonBase>
    </div>
  );
};

Button.displayName = 'Button';

export default Button;
