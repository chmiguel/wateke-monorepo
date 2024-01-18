import React from 'react';
import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  height: 35px;
  background-color: #eaeaea;
  border-radius: 18px;
  border-style: none;
  padding-left: 10px;
  padding-right: 10px;
`;

const TextField = styled.input`
  flex-grow: 1;
  flex-basis: 0;
  height: 35px;
  border-style: none;
  padding-left: 10px;
  background-color: transparent;
  &:focus {
    border-style: none;
    outline: none;
  }
`;

const Input = ({ className, children, style, ...props }) => {
  return (
    <Container style={props.containerStyle}>
      <TextField
        id={props.id}
        onKeyPress={e => {
          if (e.which === 13 && props.onPressSend) {
            props.onPressSend();
          }
        }}
        value={props.value}
        maxLength={props.maxLength}
        onChange={props.onChange}
        placeholder={props.placeholder || 'Buscar en YouTube'}
        type="text"
      />
      {props.icon ? (
        props.icon
      ) : (
        <MdSearch onClick={props.onPressSend} className="opacity" />
      )}
    </Container>
  );
};

Input.displayName = 'Input';

export default Input;
