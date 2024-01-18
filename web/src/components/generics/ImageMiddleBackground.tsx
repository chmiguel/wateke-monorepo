import React from 'react';
import styled from 'styled-components';

interface Props {
  src?: string;
}

const ImageMiddleBackground: React.FC<Props> = props => (
  <Container>
    <BackgroundImage src={props.src}>
      <Back />
    </BackgroundImage>
    <Content>{props.children}</Content>
  </Container>
);

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BackgroundImage = styled.div`
  height: 100vh;
  z-index: 1;
  background-image: ${props =>
    window.innerWidth > 500 ? `url(${props.src})` : 'none'};
  -webkit-filter: blur(8px);
  -moz-filter: blur(8px);
  -o-filter: blur(8px);
  -ms-filter: blur(8px);
  filter: blur(8px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  @media (max-width: 500) {
    background-color: #1d262c;
  }
`;

const Back = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
  margin-top: -100vh;
  z-index: 1;
  padding-top: 75px;
  flex-direction: column;
  width: 100%;
  @media (max-width: 420px) {
    padding-top: 0px;
  }
`;

export default ImageMiddleBackground;
