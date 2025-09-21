import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'

const Input = styled.input`
    border: ${props => props.$error ? 'solid 1px red': 'solid 1px rgba(82, 97, 107, 0.3)' };
    height: 20px;
    border-radius: 5px;
    padding: 6px 10px;
    outline: none;
    width: ${props => props.$full ? "100%" : "320px"};
    transition: border-color 0.15s, box-shadow 0.15s;
    :focus{
        border: ${props => props.$error ? 'solid 1px red': 'solid 1px #5DC560' };
        -webkit-box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
        -moz-box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
        box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
    }
    margin-top: 3px;
    @media (max-width: 430px) {
        width: 260px;
    }
`
const TextArea = styled.textarea`
    border: ${props => props.$error ? 'solid 1px red': 'solid 1px rgba(82, 97, 107, 0.3)' };
    border-radius: 5px;
    padding: 6px 10px;
    outline: none;
    width: ${props => props.$full ? "100%" : "320px"};
    max-width: ${props => props.$full ? "100%" : "320px"};
    min-width: ${props => props.$full ? "100%" : "320px"};
    min-height: 100px;
    transition: border-color 0.15s, box-shadow 0.15s;
    :focus{
        border: ${props => props.$error ? 'solid 1px red': 'solid 1px #5DC560' };
        -webkit-box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
        -moz-box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
        box-shadow: ${props => props.$error ? '0px 0px 8px 2px red' : '0px 0px 8px 2px rgba(93,197,96,0.7)'};
    }
    margin-top: 3px;
    @media (max-width: 430px) {
        width: ${props => props.$full ? "100%" : "260px"};
        max-width: ${props => props.$full ? "100%" : "260px"};
        min-width: ${props => props.$full ? "100%" : "260px"};
    }
`

const Label = styled.label`
    font-size: 14px;
    line-height: 1.5;
    color: ${props => props.$error ? 'red': '#212529'};
    text-align: left;
    font-weight: 600;
`

const Error = styled.span`
    color: red;
    font-size: 14px;
    padding-left: 3px;
`


const TextField = (props) => {

    return(
        <div className={`display-flex column ${props.containerClassName ? props.containerClassName : ''}`} style={props.containerStyle} >
        <Label $error={props.error}>{props.label}</Label>
        {props.type === "textarea" ? 
            <TextArea 
                placeholder={props.placeholder}
                $full={props.full}
                onChange={(e) => props.onChange(e,e.target.value)}
                style={props.style}
                $error={props.error}
            /> 
        : null }

        {props.type === "text" ? 
            <Input 
            type="text"
            placeholder={props.placeholder}
            $full={props.full}
            onChange={(e) => props.onChange(e,e.target.value)}
            style={props.style}
            $error={props.error}
        />
        :
        null
        }
        <Error>{props.error}</Error>
        </div>
    )


}
TextField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired,
  };
export default TextField;