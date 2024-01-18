import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import {FaGlobe} from 'react-icons/fa'
import {FaLock} from 'react-icons/fa'



const Label = styled.label`
    font-size: 14px;
    line-height: 1.5;
    color: #212529;
    text-align: left;
    font-weight: 600;
`

const OptionDescription = styled.div`
        margin-left: 30px;
        color: #54565b;
        font-size: 12px;
`


const TextField = (props) => {

    return(
        <div className={`display-flex column margin-top-10 ${props.containerClassName ? props.containerClassName : ''}`} style={props.containerStyle} >
        <Label>{props.label}</Label>
        <div className="margin-top-10">
            <input type="radio" id="huey" name="drone" value="1"
                     defaultChecked onClick={(e) => props.onChange(e,1)}/>
            <label htmlFor="huey" style={{marginLeft: "8px"}}><FaGlobe /> <span style={{marginLeft: "5px"}}>Público</span></label>
            <OptionDescription>Todos podran encontrar tu spot y participar en el.</OptionDescription>
        </div>

        <div className="margin-top-10">
            <input type="radio" id="dewey" name="drone" value="0"  onClick={(e) => props.onChange(e,0)}/>
            <label htmlFor="dewey" style={{marginLeft: "8px"}}><FaLock /> <span style={{marginLeft: "5px"}}>Privado</span></label>
            <OptionDescription>Solo a quines invites tendrán acceso a tu spot.</OptionDescription>
        </div>
        
        </div>
    )


}
TextField.propTypes = {
    label: PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired,
  };
export default TextField;