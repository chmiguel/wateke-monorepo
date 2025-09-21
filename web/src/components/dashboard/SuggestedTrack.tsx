import React from 'react';
import { MdAddCircle, MdCheckCircle } from 'react-icons/md';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import { accentColor } from '../../constants';
import { SongVM } from '../../core/domain/music/Music';

interface Props {
  song: SongVM;
  onPressAdd?: () => any;
}



const SuggestedTrack: React.FC<Props> = ({ song, onPressAdd }) => {
  const {
    title,
    pictureSmall,
    artistName,
    albumTitle,
    durationFormatted,
    isAlreadyInPlaylist,
  } = song;
  
  return (
    <Container>
      <MediaContainer className="row-cont">
        <ThumbnailContainer>
          <Thumbnail
            className="video-thumbnail"
            src={pictureSmall}
            alt={title}
          />
          <DurationContainer>
            <Duration>{durationFormatted}</Duration>
          </DurationContainer>
        </ThumbnailContainer>

        <MediaDesc>
          <TitleContainer className="title-cont">
            <Tooltip title={title} placement="top">
              <Title className="truncate">{title}</Title>
            </Tooltip>
          </TitleContainer>

          <Description
            style={{
              marginTop: 3,
              maxHeight: 18,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            className="small-text color-white"
          >
            {artistName}
            {albumTitle ? ` - ${albumTitle}` : ''}
          </Description>
        </MediaDesc>
        {isAlreadyInPlaylist ? (
          <div style={{ marginTop: 5 }} className="row-cont opacity">
            <MdCheckCircle color={accentColor} size={26} />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={-1}
            onClick={onPressAdd}
            style={{ marginTop: 5 }}
            className="row-cont opacity"
          >
            <MdAddCircle size={26} color="#808080" />
          </div>
        )}
      </MediaContainer>
    </Container>
  );
};

const MediaDesc = styled.div`
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
`;

const Container = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

const MediaContainer = styled.div`
  margin-top: 10px;
`;

const ThumbnailContainer = styled.div`
  background-color: black;
  width: 80px;
  height: 60px;
  position: relative;

  @media (max-width: 420px) {
    width: 60px;
    height: 40px;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const DurationContainer = styled.div`
  position: absolute;
  bottom: 3px;
  right: 3px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 1px;
  padding-bottom: 1px;
`;

const Duration = styled.p`
  color: white;
  font-size: 10px;
`;

const TitleContainer = styled.div`
  max-height: 30px;
  overflow: hidden;
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
  @media (max-width: 420px) {
    max-width: calc(100vw - 150px);
  }
  font-weight: bold;
`;

const Title = styled.p`
  font-size: 14px;
  @media (max-width: 420px) {
    font-size: 12px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #a0a0a0;
  @media (max-width: 420px) {
    font-size: 12px;
  }
`;

export default React.memo(SuggestedTrack);
