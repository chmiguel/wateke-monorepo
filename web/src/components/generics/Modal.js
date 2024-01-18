import React from 'react'
import styled from 'styled-components';


const CloseModal = styled.div`
    color: #000;
    float: right;
    font-size: 12t;
    font-weight: bold;
    position: relative;
    right: 10px;
    top: 10px;
    cursor: pointer;
    z-index: 10000000000000;
`
const Modal = (props) => {
    return(
        <div>
            <div 
                id="myModal" 
                className="modal" 
                style={{...props.style, display: props.show ? 'flex': 'none' }}
            >

            <div className="modal-content" style={props.contentStyle}>
            <CloseModal onClick={() => props.onHide()}>X</CloseModal>

                {props.children}

            </div>

            </div>

        </div>
    )
}

export default Modal