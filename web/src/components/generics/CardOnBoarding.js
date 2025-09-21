import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';


const CardOnBoarding = (props) => (
    <BoxCard>
        <MockupPc src="/assets/images/mockup-desktop.svg" alt="logo" id="desktop" />
        <Card>

            <MockupPhoneResponsive src="/assets/images/mockup-phone.svg" alt="logo" />
            <TitlesSmall $maxWidth="70%" $fontSizeResponisve="18px">
                {props.title}
            </TitlesSmall>
            <Description $maxWidth="70%" $fontSizeResponisve="12px">
                {props.description}
            </Description>
        </Card>
        <MockupPhone src="/assets/images/mockup-phone.svg" alt="logo" />
    </BoxCard>
)
CardOnBoarding.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
}
const BoxCard = styled.div`
    width: auto;
    height: 300px;
    display: flex;
    align-items: center;
    margin-left: -150px;
    @media (max-width: 1024px){
        margin-left: -50px;
    }
       @media (max-width: 768px){
        margin-left: 0px;
    }
     @media (max-width: 620px){
        margin-top:  20px
    }
`
const MockupPc = styled.img`
    width: 100%;
    max-width: 350px;
    height: auto;
    right: -70px;
    position: relative;
    @media (max-width: 1024px){
        max-width: 250px;
    }
`
const MockupPhone = styled.img`
    width: auto;
    height: 300px;
    position: relative;
    left: -50px;
    @media (max-width: 1024px){
        height: 220px;
        display: none !important
    }
      @media (max-width: 768px){
        display: none !important
    }
`
const MockupPhoneResponsive = styled.img`
    width: auto;
    height: 150px;
    display: none !important;
      @media (max-width: 768px){
        display: block !important
    }
`
const Card = styled.div`
    width: 100%;
    max-width: 500px;
    min-height: 350px;
    border-radius: 20px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    display: grid;
    grid-template-rows: 100px 1fr;
    padding-top: 20px;
    align-items: center;
    justify-items: center;
    justify-self: center;
    padding-bottom: 20px;
    @media (max-width: 768px){
        min-height: 50vh;
        grid-template-rows: 200px 100px 1fr;
    }
    @media(max-weight: 620px){
        width: 95vw;
    }
`
const TitlesSmall = styled.p`
    width: 100%;
    max-width: ${props => props.$maxWidth};
    font-family: Poppins;
    font-size: ${props => props.$fontSize || "28px"};
    font-weight: ${props => props.$fontWeight || "bold"};
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: ${props => props.$textAlign || "left"};
    color: ${props => props.$colorText || "#0d1419"};
    @media (max-width: 768px){
        max-width: 95%;
        text-align: center;
        font-size: ${props => props.$fontSizeResponisve};
    }
`
const Description = styled.p`
    width: 100%;
    max-width: ${props => props.$maxWidth};
    font-family: Poppins;
    font-size: ${props => props.$fontSize || "16px"};
    font-weight: ${props => props.$fontWeight || "normal"};
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: ${props => props.$textAlign || "center"};
    color: ${props => props.$colorText || "#979ca8"};
     @media (max-width: 768px){
        max-width: 95%;
        font-size: ${props => props.$fontSizeResponisve};
        text-align: center;
    }
`
export default CardOnBoarding