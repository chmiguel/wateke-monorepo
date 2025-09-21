import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowDown, MdSchedule } from 'react-icons/md';
import moment from 'moment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ChatMessage } from '../../core/domain/chat/Chat';
import randomMC from 'random-material-color';

interface Props extends ChatMessage {
  isFromUser: boolean;
  onReplyPressed?: (chatMessage: ChatMessage) => void;
  onRepliedMessagePressed?: () => void;
}

const MessageItem: React.FC<Props> = props => {
  const { onReplyPressed, onRepliedMessagePressed, ...chatMessage } = props;
  const {
    id,
    isFromUser,
    type,
    repliedMessage,
    songArtistName,
    songTitle,
    senderName,
    songThumbnail,
    message,
    createdAt,
    userColor,
    mentions,
    pending,
  } = chatMessage;

  const handleReplyPressed = useCallback(() => {
    setMenuOpened(null)
    if(onReplyPressed) onReplyPressed(chatMessage)
  }, [id]);

  const [menuOpened, setMenuOpened] = useState<SVGElement | null>(null);
  const publisherColor =
    type === 'reply' && repliedMessage
      ? randomMC.getColor({ text: repliedMessage.senderName })
      : null;

  return (
    <MessageAlign $isFromUser={isFromUser} $type={type}>
      <Container id={id} $type={type}>
        {type !== 'song' ? (
          <div className="row-cont">
            <MessageSender $color={userColor!}>{senderName}</MessageSender>
            <MdKeyboardArrowDown
              aria-owns={menuOpened ? 'simple-menu-message' : undefined}
              aria-haspopup="true"
              onClick={event => setMenuOpened(event.currentTarget)}
              color="#fff"
              size={16}
              style={{ position: 'absolute', right: 3, top: 3 }}
              className="opacity"
            />
            <Menu
              id="simple-menu-message"
              anchorEl={menuOpened as HTMLElement | null}
              open={Boolean(menuOpened)}
              onClose={() => setMenuOpened(null)}
            >
              <MenuItem
                onClick={handleReplyPressed}
              >
                Responder
              </MenuItem>
            </Menu>
          </div>
        ) : null}

        {type === 'reply' &&
        repliedMessage &&
        (repliedMessage.type === 'song' ||
          repliedMessage.type === undefined) ? (
          <Reply onClick={onRepliedMessagePressed}>
            <div className="row-cont">
              <AnswerBar $color={publisherColor} />
              <div>
                <div className="row-cont">
                  <img
                    src={repliedMessage && repliedMessage.songThumbnail}
                    alt="song cover"
                  />
                  <div>
                    <p style={{ marginBottom: 3, color: publisherColor }}>
                      <b>{repliedMessage.senderName}:</b>
                    </p>
                    <p>
                      <b>{repliedMessage.songArtistName}</b> |{' '}
                      {repliedMessage.songTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reply>
        ) : null}
        {type === 'reply' &&
        repliedMessage &&
        repliedMessage.type === 'text' ? (
          <Reply onClick={onRepliedMessagePressed}>
            <div className="row-cont">
              <AnswerBar $color={publisherColor} />
              <div>
                <div style={{ marginBottom: 5 }} className="row-cont">
                  <div>
                    <p style={{ marginBottom: 3, color: publisherColor }}>
                      <b>{repliedMessage.senderName}:</b>
                    </p>
                    {repliedMessage.mentions ? (
                      <p
                        className="con-html"
                        dangerouslySetInnerHTML={{
                          __html: repliedMessage.message!,
                        }}
                      />
                    ) : (
                      <p>{repliedMessage.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reply>
        ) : null}
        {type === 'song' ? (
          <Song>
            <div className="row-cont">
              <img src={songThumbnail} alt="song cover" />
              <div>
                <MessageSender $color={userColor!}>
                  {senderName}{' '}
                  <span style={{ fontWeight: 400, color: '#fff' }}>
                    ha postulado
                  </span>
                  :
                </MessageSender>
                <p>
                  <b>{songArtistName}</b> | {songTitle}
                </p>
              </div>
            </div>
            <MdKeyboardArrowDown
              aria-owns={menuOpened ? 'simple-menu-message' : undefined}
              aria-haspopup="true"
              onClick={event => setMenuOpened(event.currentTarget)}
              color="#fff"
              size={16}
              className="opacity menu-options"
            />
            <Menu
              id="simple-menu-message"
              anchorEl={menuOpened as HTMLElement | null}
              open={Boolean(menuOpened)}
              onClose={() => setMenuOpened(null)}
            >
              <MenuItem
                onClick={handleReplyPressed}
              >
                Responder
              </MenuItem>
            </Menu>
          </Song>
        ) : null}
        {type !== 'song' ? (
          <React.Fragment>
            {mentions ? (
              <MessageText
                className="con-html"
                dangerouslySetInnerHTML={{
                  __html: message || '',
                }}
              />
            ) : (
              <MessageText>{message || ''}</MessageText>
            )}
            <MessageDate>
              {pending || !createdAt ? (
                <MdSchedule size={12} color="#808080" />
              ) : (
                moment(createdAt.seconds * 1000).format('HH:mm')
              )}
            </MessageDate>
          </React.Fragment>
        ) : null}
      </Container>
    </MessageAlign>
  );
};

interface MessageAlignProps {
  $isFromUser: boolean;
  $type: 'text' | 'song' | 'reply';
}

const MessageAlign = styled.div<MessageAlignProps>`
  display: flex;
  justify-content: ${props => (props.$isFromUser ? 'flex-end' : 'flex-start')};
  margin: 10px;
  margin-left: ${props => (props.$isFromUser ? '40px' : '10px')};
  margin-right: ${props => (!props.$isFromUser ? '40px' : '10px')};
`;

const Reply = styled.div`
  background-color: #80808020;
  margin-bottom: 5px;
  padding-right: 10px;
  padding-left: 0px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  p:nth-child(1) {
    color: #fff;
    font-size: 12px;
  }
  p:nth-child(2) {
    color: #fff;
    font-size: 12px;
  }
  p:nth-child(3) {
    color: #fff;
    font-size: 12px;
  }
`;

const Song = styled.div`
  position: relative;
  padding: 10px;
  padding-left: 0px;
  padding-right: 25px;
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  p:nth-child(1) {
    font-size: 12px;
  }
  p:nth-child(2) {
    color: #fff;
    font-size: 12px;
  }
  p:nth-child(3) {
    color: #fff;
    font-size: 12px;
  }
  .menu-options {
    position: absolute;
    right: 3px;
    top: 3px;
  }
`;

const AnswerBar = styled.div<{ $color?: string }>`
  height: 54px;
  flex: 1;
  width: 3px;
  min-width: 3px;
  max-width: 3px;
  background-color: ${props => props.$color || '#fff'};
  margin-right: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

interface ContainerProps {
  id?: string;
  $type: 'text' | 'song' | 'reply';
}

const Container = styled.div<ContainerProps>`
  position: relative;
  padding: 5px 10px 5px 10px;
  background-color: ${props =>
    props.$type === 'song' ? 'transparent' : '#202020'};

  color: #fff;
  border-radius: 8px;
  transition-duration: 0.4s;
  transition-property: 'background-color';
`;

const MessageSender = styled.p<{ $color: string }>`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
  margin-right: 12px;
  color: ${props => props.$color};
`;

const MessageText = styled.p`
  margin-bottom: 12px;
  font-size: 13px;
`;

const MessageDate = styled.p`
  font-size: 10px;
  position: absolute;
  right: 10px;
  bottom: 2px;
`;

const arePropsEqual = (prev: Props, next: Props) => {
  const isSameId = prev.id === next.id;
  const isStillPending = next.createdAt?.seconds === prev.createdAt?.seconds;
  return isSameId && isStillPending;
};

export default React.memo(MessageItem, arePropsEqual);
