import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'



const Button = styled.button`
    background-color: ${props => props.$disabled ? '#353a50': '#00fece'};
    border-color: ${props => props.$disabled ? '#353a50': '#00fece'};
    color: #000;
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    padding: 6px 15px;
    user-select: none;
    border: 1px solid transparent;
    height: 35px;
    :hover{
        background-color:  ${props => props.$disabled ? '#353a50': '#02c7a2'};
    }
    outline: none;
`


const ButtonContainer = (props) => {
    return(
        <div>
        <Button onClick={() => props.onClick()} style={props.style} $disabled={props.disabled}>{props.label}</Button>
        </div>
    )
}

ButtonContainer.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    disabled: PropTypes.bool
  };

  export default ButtonContainer;