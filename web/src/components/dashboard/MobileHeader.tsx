import React from 'react';
import styled from 'styled-components';
import { PublishedSong } from '../../core/domain/music/Music';

interface Props {
  currentSong?: PublishedSong;
}

const MobileHeader: React.FC<Props> = props => {
  const { currentSong } = props;

  const image = currentSong?.song.pictureMedium;
  const songName = currentSong?.song.title;
  const artist = currentSong?.song.artistName;

  return (
    <Container image={image}>
      <ContainerOpacity className="total-center">
        <RestrictedBox>
          <div className="row-cont">
            <div>
              {currentSong ? (
                <div className="row-cont space-between">
                  <Title>Lo que esta sonando:</Title>
                </div>
              ) : null}
              {currentSong && currentSong.song ? (
                <Artist>
                  <span className="bold-text white-text">{artist}</span> |{' '}
                  {songName}
                </Artist>
              ) : null}
            </div>
          </div>
        </RestrictedBox>
      </ContainerOpacity>
    </Container>
  );
};

interface ContainerProps {
  image?: string;
}

const Container = styled.div<ContainerProps>`
  display: none;
  height: 200px;
  background-image: ${props =>
    props.image && window.innerWidth <= 420 ? `url(${props.image})` : 'none'};
  width: 100vw;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @media (max-width: 420px) {
    display: flex;
  }
`;

const RestrictedBox = styled.div`
  width: 80%;
  max-width: 280px;
`;

const ContainerOpacity = styled.div`
  width: 100%;
  height: calc(100% - 30px);
  background: linear-gradient(to bottom, #1d262c, rgba(29, 38, 44, 0.7));
  padding: 20px 20px 10px 20px;
`;
const Title = styled.p`
  color: #a0a0a0;
  font-size: 12px;
`;

const Artist = styled.p`
  color: #a0a0a0;
`;

export default MobileHeader;
