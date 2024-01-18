import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div>
    <Container>
      <div>
        <div>
          <LogoStore src="/assets/images/logo-white.svg" alt="logo" />
        </div>
      </div>
      <div>
        <MainTitle
          fontSize="18px"
          textAlign="center"
          fontWeight="bold"
          colorText="#FFF"
        >
          Legal
        </MainTitle>
        <Description
          fontSize="14px"
          colorText="#979ca8"
          className="margin-top-20"
        >
          Terminos y condiciones{' '}
        </Description>
        <Link to="/privacy-policy">
          <Description fontSize="14px" colorText="#979ca8">
            Política y privacidad{' '}
          </Description>
        </Link>
        <Description fontSize="14px" colorText="#979ca8">
          Cookies{' '}
        </Description>
      </div>
      <div>
        <MainTitle
          fontSize="18px"
          textAlign="center"
          fontWeight="bold"
          colorText="#FFF"
        >
          Contacto
        </MainTitle>
        <Description
          fontSize="14px"
          colorText="#979ca8"
          className="margin-top-20"
        >
          ch.miguel3@gmail.com{' '}
        </Description>
      </div>
      <div>
        <MainTitle
          fontSize="18px"
          textAlign="center"
          fontWeight="bold"
          colorText="#FFF"
        >
          Nuestras redes
        </MainTitle>
        <div className="margin-top-20">
          <a
            href="https://www.facebook.com/watekemusic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook
              size={25}
              color="#00fece"
              style={{ marginLeft: '15px', cursor: 'pointer' }}
            />
          </a>
          <a
            href="https://twitter.com/watekemusic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter
              size={25}
              color="#00fece"
              style={{ marginLeft: '15px', cursor: 'pointer' }}
            />
          </a>
          <a
            href="https://www.instagram.com/watekemusic/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              size={25}
              color="#00fece"
              style={{ marginLeft: '15px', cursor: 'pointer' }}
            />
          </a>
        </div>
      </div>
    </Container>
    <FooterFrangi>Wateke Music Todos los derechos Reservados.</FooterFrangi>
  </div>
);
const Container = styled.div`
  width: 100%;
  min-height: 150px;
  box-shadow: 0 -4px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #0d1419;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  padding-top: 20px;
  justify-items: center;
  align-items: start;
  grid-row-gap: 50px;
  padding-bottom: 30px;
`;
const LogoStore = styled.img`
  width: 150px;
  height: auto;
`;
const FooterFrangi = styled.div`
  width: 100%px;
  height: 49px;
  box-shadow: 0 -4px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #00fece;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.53;
  letter-spacing: normal;
  text-align: center;
  color: #0d1419;
`;
const MainTitle = styled.p`
  width: 100%;
  max-width: ${props => props.maxWidth};
  font-family: Poppins;
  font-size: ${props => props.fontSize || '60px'};
  font-weight: ${props => props.fontWeight || '600'};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: ${props => props.textAlign || 'left'};
  color: ${props => props.colorText || '#00fece'};
  margin-top: ${props => props.marginTop};
  @media (max-width: 768px) {
    font-size: ${props => props.fontSizeResponisve};
    text-align: center;
  }
`;
const Description = styled.p`
  width: 100%;
  max-width: ${props => props.maxWidth};
  font-family: Poppins;
  font-size: ${props => props.fontSize || '14px'};
  font-weight: ${props => props.fontWeight || 'normal'};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: ${props => props.textAlign || 'center'};
  cursor: pointer;
  color: ${props => props.colorText || '#979ca8'};
  @media (max-width: 768px) {
    max-width: 95%;

    font-size: ${props => props.fontSizeResponisve};
  }
`;
export default Footer;
