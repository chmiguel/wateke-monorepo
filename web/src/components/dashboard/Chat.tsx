// @ts-nocheck
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import styled from 'styled-components';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { MdClear, MdInsertEmoticon } from 'react-icons/md';
import { ClickAwayListener } from '@mui/material';
import { backgroundColor, accentColor } from '../../constants';
import MessageItem from './MessageItem';
import { ReplyPayload } from '../../core/domain/chat/Chat';
import withBloc from '../../core/withBlocHOC';
import BlocsFactory from '../../BlocsFactory';
import { BlocBuilder, useBloc } from '../../core/state';
import ChatBloc from '../../presenters/ChatBloc';
import UserBloc from '../../core/blocs/UserBloc';
import DashboardBloc from '../../presenters/DashboardBloc';

interface Props {
  onSongReplyCleaned: () => void;
  songReply?: ReplyPayload | null;
  isVisible: boolean;
}

const Chat: React.FC<Props> = ({
  songReply,
  onSongReplyCleaned,
  isVisible,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const [state, bloc] = useBloc(ChatBloc);
  const [userState] = useBloc(UserBloc, { subscribe: false });

  const { messages, currentMessage, reply } = state;

  const scrollToLastMessage = useCallback((delayInMS = 500) => {
    setTimeout(() => {
      const chatList = window.document.getElementById('chat-list');
      if (chatList) chatList.scrollTop = chatList.scrollHeight;
    }, delayInMS);
  }, []);

  const focusMessageInput = useCallback(() => {
    if (!textInput.current) return;
    setTimeout(() => textInput.current!.focus(), 500);
  }, []);

  useEffect(() => {
    bloc.start(userState, scrollToLastMessage, focusMessageInput);
    return bloc.unmount;
  }, []);

  useEffect(() => {
    if (songReply) bloc.prepareReply(songReply);
  }, [songReply]);

  useEffect(() => {
    const wasLocalReplyCleaned = songReply && !reply;
    if (wasLocalReplyCleaned) onSongReplyCleaned();
  }, [songReply, reply]);

  const handleKeyPress: React.KeyboardEventHandler<
    HTMLTextAreaElement
  > = event => {
    if (event.which === 13 || event.keyCode === 13) bloc.sendCurrentMessage();
  };

  return (
    <Container show={isVisible}>
      <ScrollContainer id="chat-list">
        {messages.length ? (
          messages.map(item => (
            <MessageItem
              key={item.id}
              {...item}
              isFromUser={item.senderUID === userState.uid}
              onRepliedMessagePressed={() => {
                if (item.repliedMessage && item.repliedMessage.id) {
                  const repliedMessage = window.document.getElementById(
                    item.repliedMessage.id,
                  );
                  if (repliedMessage) {
                    const chatList =
                      window.document.getElementById('chat-list');
                    chatList!.scrollTop = repliedMessage.offsetTop - 100;
                    repliedMessage.style.backgroundColor = '#80808080';
                    if (item.repliedMessage.type !== 'text')
                      repliedMessage.style.borderRadius = '8px';
                    setTimeout(() => {
                      if (item.repliedMessage!.type !== 'text') {
                        repliedMessage.style.backgroundColor = 'transparent';
                        repliedMessage.style.borderRadius = '0px';
                      } else {
                        repliedMessage.style.backgroundColor = '#202020';
                      }
                    }, 500);
                  }
                }
              }}
              onReplyPressed={bloc.prepareReplyForMessage}
            />
          ))
        ) : (
          <NoMessages>
            Aún no hay mensajes. Sé el primero en enviar uno.
          </NoMessages>
        )}

        {reply && reply.type === 'song' ? (
          <ReplyContainer>
            <ReplyItem>
              <AnswerBar color={reply.userColor} />
              <img src={reply.songThumbnail} alt="song-cover" />
              <div>
                <p
                  style={
                    reply.userColor ? { color: reply.userColor } : undefined
                  }
                >
                  <b>{reply.senderName}</b>
                </p>
                <p>
                  <b>{reply.songArtistName}</b> | {reply.songTitle}
                </p>
              </div>
              <div>
                <MdClear
                  onClick={bloc.removeReply}
                  className="opacity"
                  size={16}
                  color="#a0a0a0"
                />
              </div>
            </ReplyItem>
          </ReplyContainer>
        ) : null}
        {reply && reply.type === 'text' ? (
          <ReplyContainer>
            <ReplyItem>
              <AnswerBar color={reply.userColor} />
              <div style={{ flex: 1 }}>
                <p
                  style={
                    reply.userColor ? { color: reply.userColor } : undefined
                  }
                >
                  <b>{reply.senderName}</b>
                </p>
                {reply.mentions ? (
                  <p dangerouslySetInnerHTML={{ __html: reply.message! }} />
                ) : (
                  <p>{reply.message}</p>
                )}
              </div>
              <div>
                <MdClear
                  onClick={bloc.removeReply}
                  className="opacity"
                  size={16}
                  color="#a0a0a0"
                />
              </div>
            </ReplyItem>
          </ReplyContainer>
        ) : null}
      </ScrollContainer>
      {showEmojiPicker ? (
        <EmojiPicker>
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <Picker
              color={accentColor}
              native
              showPreview={false}
              showSkinTones={false}
              theme="dark"
              onSelect={(emoji: { native: string }) =>
                bloc.addEmojiToCurrentText(emoji.native)
              }
              i18n={{
                search: 'Buscar',
                categories: {
                  search: 'Resultados de busqueda',
                  recent: 'Recientes',
                },
              }}
            />
          </ClickAwayListener>
        </EmojiPicker>
      ) : null}
      <InputContainer>
        <MdInsertEmoticon
          onClick={() => {
            if (!showEmojiPicker) setShowEmojiPicker(true);
          }}
          size={26}
          color="#505050"
        />
        <BlocBuilder
          blocClass={DashboardBloc}
          builder={([{ spotUsers }]) => (
            <MentionsInput
              className="my-mention-input"
              placeholder="Escribir mensaje"
              value={currentMessage}
              singleLine
              onChange={(e, newValue) => {
                bloc.handleCurrentMessageTextChange(newValue);
              }}
              onKeyPress={handleKeyPress}
              style={defaultStyles}
              inputRef={textInput}
            >
              <Mention
                appendSpaceOnAdd
                trigger="@"
                markup="@[__display__]@@(user:__id__)@"
                displayTransform={(id: any, display: any) => `@${display}`}
                data={
                  Array.isArray(spotUsers)
                    ? spotUsers.map(({ name: display, uid: id }) => ({
                        display,
                        id,
                      }))
                    : []
                }
                style={{ backgroundColor: '#019afd60' }}
                renderSuggestion={(
                  suggestion: string,
                  search: string,
                  highlightedDisplay: string,
                ) => (
                  <div className="user" style={{ color: '#000', padding: 10 }}>
                    {highlightedDisplay}
                  </div>
                )}
              />
            </MentionsInput>
          )}
        />
      </InputContainer>
    </Container>
  );
};

const ScrollContainer = styled.div`
  height: calc(100% - 90px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;

  padding-bottom: 80px;
  padding-top: 10px;
`;

const Container = styled.div`
  position: relative;
  display: ${props => (props.show ? 'block' : 'none')};
  /* background-color: ${backgroundColor}80; */
  width: 100%;
  height: calc(100% - 40px);
  @media (max-width: 992px) {
    padding-bottom: 50px;
    margin-bottom: 20px;
  }
  @media (max-width: 420px) {
    margin-bottom: 0px;
    /* width: 100vw; */
    /* margin-left: -9px; */
    height: calc(100% - 55px);
  }
`;

const ReplyContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 60px;
  max-height: 90px;
  padding: 10px;
  background-color: #0d1419;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  z-index: 1;

  p {
    font-size: 12px;
    color: #fff;
  }
  div:nth-child(2) {
    background-color: #202020;
    border-radius: 4px;
    padding: 7px;
  }
  div:nth-child(4) {
    position: absolute;
    right: 5px;
    top: 3px;
  }
`;

const ReplyItem = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 50px;
    width: 50px;
    margin-right: 10px;
  }
`;

const AnswerBar = styled.div`
  min-height: 54px;
  height: 100%;
  width: 3px;
  background-color: ${props => props.color || '#fff'};
  margin-right: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const InputContainer = styled.div`
  position: absolute;
  background-color: #111a1f;
  left: 0px;
  right: 0px;
  bottom: 0px;
  max-height: 60px;
  box-shadow: -5px -5px 10px #00000080;
  padding: 10px;
  display: flex;
  align-items: center;
`;

const EmojiPicker = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 60px;
  z-index: 2;
`;

const NoMessages = styled.p`
  color: #fff;
  font-size: 12px;
  margin: 30px;
  text-align: center;
`;

const defaultStyles = {
  control: {
    fontSize: 14,
    fontWeight: 'normal',
    width: '100%',
  },

  highlighter: {
    overflow: 'hidden',
    width: '100%',
  },

  input: {
    margin: 0,
  },

  '&singleLine': {
    control: {
      display: 'inline-block',

      width: 130,
    },

    highlighter: {
      padding: 2,
      border: '2px inset transparent',
      left: -2,
      top: 2,
    },

    input: {
      padding: 1,
    },
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      border: '1px solid silver',
    },

    highlighter: {
      padding: 9,
    },

    input: {
      padding: 9,
      minHeight: 63,
      outline: 0,
      border: 0,
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },

    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',

      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
};

export default withBloc(Chat, () => BlocsFactory.chatBloc());
