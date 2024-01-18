import React, { PureComponent } from 'react';
import { FaHeart, FaRegHeart, FaHeartBroken } from 'react-icons/fa';
import Tooltip from '@material-ui/core/Tooltip';
import { MdMoreVert } from 'react-icons/md';
import styled from 'styled-components';
import { Menu, MenuItem } from '@material-ui/core';
import { accentColor } from '../../constants';
import TrackTooltip from './TrackTooltip';
import { withStyles } from '@material-ui/core';
import randomMaterialColor from 'random-material-color';
import { ReplyPayload } from '../../core/domain/chat/Chat';

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#1B2631',
    padding: 0,
    opacity: 1.0,
  },
  popper: { opacity: 1.0 },
}))(Tooltip);

interface Props {
  publishedSongId: string;
  songId: number | string;
  songTitle: string;
  songArtistName: string;
  songThumbnail: string;
  songAlbumTitle?: string;
  publisherName: string;
  publisherAvatar: string;
  publisherUID: string;
  userUID: string;
  usersWhoLike?: { [userUID: string]: boolean };
  shouldShowAdminOptions?: boolean;
  shouldShowPlayNowOption?: boolean;
  onPlayPressed: () => any;
  onDeletePressed: (publishedSonId: string, songId: number | string) => any;
  onReactionPressed: (publishedSongId: string, reaction: boolean | null) => any;
  onReplySongPressed?: (replyPayload: ReplyPayload) => any;
}

interface State {
  anchorEl?: SVGElement | null;
}

class PostedTrack extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = (event: React.MouseEvent<SVGElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLike = (currentReaction?: boolean | null) => {
    const { onReactionPressed, publishedSongId } = this.props;

    if (onReactionPressed) {
      onReactionPressed(publishedSongId, currentReaction ? null : true);
    }
  };

  handleDislike = (currentReaction?: boolean | null) => {
    const { onReactionPressed, publishedSongId } = this.props;
    if (onReactionPressed) {
      onReactionPressed(
        publishedSongId,
        currentReaction === false ? null : false,
      );
    }
  };

  handleReply = () => {
    const {
      songTitle,
      songArtistName,
      songThumbnail,
      publishedSongId,
      publisherName,
      publisherAvatar,
      publisherUID,
      onReplySongPressed,
    } = this.props;
    if (!onReplySongPressed) return;
    onReplySongPressed({
      publishedSongId: publishedSongId,
      songTitle: songTitle,
      songArtistName: songArtistName,
      songThumbnail: songThumbnail,
      senderName: publisherName,
      senderAvatar: publisherAvatar,
      senderUID: publisherUID,
      userColor: randomMaterialColor.getColor({ text: publisherName }),
      type: 'song',
    });
    this.handleClose();
  };

  handleDelete = () => {
    this.handleClose();
    if (!this.props.onDeletePressed) return;
    this.props.onDeletePressed(this.props.publishedSongId, this.props.songId);
  };

  render() {
    const {
      songTitle,
      songArtistName,
      songThumbnail,
      songAlbumTitle,
      publisherName,
      publisherAvatar,
      publisherUID,
      userUID,
      usersWhoLike,
      shouldShowAdminOptions,
      shouldShowPlayNowOption,
      onPlayPressed,
    } = this.props;

    const { anchorEl } = this.state;
    let likes = 0;
    let dislikes = 0;
    if (usersWhoLike) {
      Object.keys(usersWhoLike).forEach(item => {
        if (usersWhoLike[item] === true) {
          likes += 1;
        } else {
          dislikes += 1;
        }
      });
    }

    return (
      <div>
        <Container nextToPlay={false}>
          <ThumbnailContainer src={songThumbnail} />
          <HtmlTooltip
            title={
              <TrackTooltip
                songTitle={songTitle}
                songArtistName={songArtistName}
                songThumbnail={songThumbnail}
                publisherName={publisherName}
                publisherAvatar={publisherAvatar}
              />
            }
            placement="top"
            interactive
          >
            <VideoDesc className="opacity">
              <TitleContainer className="title-cont">
                <Title className="truncate">{songTitle}</Title>
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
                {songArtistName}
                {songAlbumTitle ? ` - ${songAlbumTitle}` : ''}
              </Description>
            </VideoDesc>
          </HtmlTooltip>
          <LikesContainer>
            <div
              role="button"
              tabIndex={-1}
              onClick={() => this.handleLike(usersWhoLike?.[userUID])}
              className="row-cont opacity"
            >
              {usersWhoLike && usersWhoLike[userUID] ? (
                <FaHeart color={accentColor} size={20} />
              ) : (
                <FaRegHeart color="#808080" size={20} />
              )}
            </div>

            <ReactionsNumber>
              {likes - dislikes <= 0 ? (
                <span
                  style={{
                    color: likes - dislikes === 0 ? '#fff' : '#ea4335',
                    fontSize: '12px',
                  }}
                >
                  {likes - dislikes}
                </span>
              ) : (
                <span
                  style={{ fontSize: '12px' }}
                  className="color-primary"
                >{`+${likes - dislikes}`}</span>
              )}
            </ReactionsNumber>

            <div
              role="button"
              tabIndex={-1}
              onClick={() => this.handleDislike(usersWhoLike?.[userUID])}
              className="row-cont opacity"
            >
              <FaHeartBroken
                color={
                  usersWhoLike?.[userUID] === false ? '#ea4335' : '#808080'
                }
                size={20}
              />
            </div>

            <MdMoreVert
              style={{ marginTop: 2 }}
              size={26}
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
              color="#fff"
              className="opacity"
            />

            <Menu
              id="simple-menu"
              anchorEl={anchorEl as HTMLElement | null}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {shouldShowPlayNowOption ? (
                <MenuItem
                  onClick={() => {
                    this.handleClose();
                    if (typeof onPlayPressed === 'function') onPlayPressed();
                  }}
                >
                  Reproducir
                </MenuItem>
              ) : null}
              {shouldShowAdminOptions || publisherUID === userUID ? (
                <MenuItem onClick={this.handleDelete}>Eliminar</MenuItem>
              ) : null}
              <MenuItem onClick={this.handleReply}>Responder en chat</MenuItem>
            </Menu>
          </LikesContainer>
        </Container>
      </div>
    );
  }
}

const Container = styled.div`
  padding: ${props => (props.nextToPlay ? '0' : '10px 0px 10px 10px')};
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.nextToPlay ? '#0d1419' : 'transparent')};
`;

const ThumbnailContainer = styled.div`
  width: 80px;
  min-width: 80px;
  height: 60px;
  background-image: ${props => `url(${props.src})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  @media (max-width: 420px) {
    width: 60px;
    min-width: 60px;
    height: 40px;
  }
`;

const VideoDesc = styled.div`
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  max-width: calc(100% - 200px);
  flex: 1;
  @media (max-width: 420px) {
    max-width: calc(100vw - 205px);
  }
`;

const TitleContainer = styled.div`
  max-height: 30px;
  overflow: hidden;
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
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

const LikesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  min-width: 100px;
`;

const ReactionsNumber = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

export default PostedTrack;
