import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-width: 280px;
  padding: 0px;
  padding-right: 10px;
`;

const Avatar = styled.img`
  height: 30px;
  width: 30px;
  margin-right: 10px;
  border-radius: 15px;
`;

const Thumbnail = styled.img`
  min-height: 80px;
  min-width: 80px;
  height: 80px;
  width: 80px;
`;

const Info = styled.div`
  padding-left: 10px;
  padding-top: 5px;
`;

const PublisherName = styled.p`
  color: #fff;
  font-weight: bold;
`;

const Title = styled.p`
  font-size: 12px;
  margin-bottom: 5px;
  max-height: 60px;
  overflow: hidden;
`;

function shortText(text: string) {
  if (text && text.length > 40) {
    return `${text.substr(0, 40)}...`;
  }
  return text;
}

interface Props {
  songTitle: string;
  songArtistName: string;
  songThumbnail: string;
  publisherAvatar: string;
  publisherName: string;
}

// eslint-disable-next-line prefer-arrow-callback
const TrackTooltip = React.forwardRef<any,Props>(function TrackTooltip(
  {
    songTitle,
    songArtistName,
    songThumbnail,
    publisherAvatar,
    publisherName,
    ...props
  },
  ref,
) {
  return (
    <Container {...props} ref={ref}>
      <div className="row-cont">
        <Thumbnail src={songThumbnail} />
        <Info>
          <Title>
            <b>{shortText(songTitle)}</b> | {songArtistName}
          </Title>
          <div className="row-cont">
            <Avatar src={publisherAvatar} />
            <PublisherName>{publisherName}</PublisherName>
          </div>
        </Info>
      </div>
    </Container>
  );
});

export default TrackTooltip;
