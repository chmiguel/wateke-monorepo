import React, { Fragment, ReactElement, useCallback, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MdSearch, MdArrowBack } from 'react-icons/md';
import { CircularProgress } from '@mui/material';
import { getPlayerBounds, filterSongs } from '../lib/utilities';
import Footer from '../components/generics/Footer';
import ImageMiddleBackground from '../components/generics/ImageMiddleBackground';
import SuggestedTrack from '../components/dashboard/SuggestedTrack';
import PostedTrack from '../components/dashboard/PostedTrack';
import MobileHeader from '../components/dashboard/MobileHeader';
import { BlocBuilder, useBloc } from '../core/state';
import DashboardBloc, { DashboardTab } from '../presenters/DashboardBloc';
import withBloc from '../core/withBlocHOC';
import BlocsFactory from '../BlocsFactory';
import SelectedSpot, {
  SelectedSpotState,
} from '../core/blocs/SelectedSpotBloc';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import UserBloc from '../core/blocs/UserBloc';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { BlocChangeEvent } from '../core/blocPattern';
import Player from '../components/dashboard/Player';
// import FlipMove from 'react-flip-move'; // Temporarily disabled for React 18 compatibility

const getTabsStyle = (isActive: boolean) => ({
  label: isActive ? 'color-primary' : 'color-white',
});

const Dashboard: React.FC = (): ReactElement => {
  const [state, dashboardBloc] = useBloc(DashboardBloc);
  const [initialSpotState, selectedSpotBloc] = useBloc(SelectedSpot, {
    subscribe: true,
  });
  const [userState] = useBloc(UserBloc);

  useEffect(() => {
    const spot = selectedSpotBloc.startSelectedSpot(dashboardBloc);
    dashboardBloc.start(spot!.id, spot!.creator);

    return () => {
      selectedSpotBloc.unmount();
      dashboardBloc.unmount();
    };
  }, []);

  const { width: playerWidth } = getPlayerBounds(
    initialSpotState.config?.provider as string,
  );

  const shouldUpdatePlayerComponent = useCallback(
    ({ currentState, nextState }: BlocChangeEvent<SelectedSpotState>) => {
      const hasChangedCurrentSong =
        !currentState.currentSong ||
        currentState.currentSong?.id !== nextState.currentSong?.id;
      const hasChangedFinishingSong =
        currentState.spot?.finishingSong !== nextState.spot?.finishingSong;
      const hasProviderChanged =
        !currentState.config ||
        currentState.config.provider !== nextState.config?.provider;

      return (
        hasChangedCurrentSong || hasChangedFinishingSong || hasProviderChanged
      );
    },
    [],
  );

  const isNotMobileScreen = window.innerWidth > 500;

  return (
    <DashboardLayout>
      <ImageMiddleBackground src={initialSpotState?.spot!.coverPicture}>
        <Container>
          <OpacityContainer>
            <ContentContainer>
              {!isNotMobileScreen && (
                <BlocBuilder
                  blocClass={SelectedSpotBloc}
                  builder={([selectedSpotState]) => (
                    <MobileHeader currentSong={selectedSpotState.currentSong} />
                  )}
                />
              )}
              <VideoContainer $playerWidth={playerWidth}>
                <BlocBuilder
                  blocClass={SelectedSpotBloc}
                  shouldUpdate={shouldUpdatePlayerComponent}
                  builder={([selectedSpotState]) => {
                    return (
                      <Player
                        shouldKeepPlayerHidden={!isNotMobileScreen}
                        shouldFadeSoundWhenFinishingSong={
                          !selectedSpotBloc.isCurrentUserAdmin()
                        }
                        songId={selectedSpotState.currentSong?.song?.id}
                        song={selectedSpotState.currentSong?.song}
                        onSongEnded={
                          selectedSpotBloc.finishCurrentSongAndChangeToNext
                        }
                        onSongAboutToEnd={
                          selectedSpotBloc.prepareCurrentSongToEnd
                        }
                        isSongFinishing={selectedSpotState.spot!.finishingSong}
                        onPlayerReady={dashboardBloc.loadSuggestions}
                        musicProvider={selectedSpotState.config?.provider}
                      />
                    );
                  }}
                />

                <BlocBuilder
                  blocClass={SelectedSpotBloc}
                  builder={([state]) => {
                    const nextSongToPlay = state?.currentPlaylist?.[0];
                    if (!nextSongToPlay || !nextSongToPlay.publisher)
                      return <React.Fragment />;
                    return (
                      <NextSongContainer>
                        <br />
                        <NextText>Próximo en reproducir:</NextText>
                        <PostedTrack
                          onReplySongPressed={dashboardBloc.replyToSong}
                          userUID={userState.uid!}
                          usersWhoLike={nextSongToPlay.usersWhoLike}
                          publishedSongId={nextSongToPlay.id}
                          publisherUID={nextSongToPlay.publisher.uid!}
                          publisherName={nextSongToPlay.publisher.name!}
                          publisherAvatar={nextSongToPlay.publisher.avatar!}
                          songId={nextSongToPlay.song.id}
                          songTitle={nextSongToPlay.song.title}
                          songArtistName={nextSongToPlay.song.artistName}
                          songAlbumTitle={nextSongToPlay.song.albumTitle}
                          songThumbnail={nextSongToPlay.song.pictureSmall!}
                          onReactionPressed={selectedSpotBloc.reactToSong}
                          onPlayPressed={
                            selectedSpotBloc.finishCurrentSongAndChangeToNext
                          }
                          onDeletePressed={
                            selectedSpotBloc.removeSongFromPlaylist
                          }
                          shouldShowAdminOptions={selectedSpotBloc.isCurrentUserAdmin()}
                          shouldShowPlayNowOption
                        />
                      </NextSongContainer>
                    );
                  }}
                />
              </VideoContainer>
              <ResultsContainer>
                <SearchContainer>
                  <InputContainer>
                    <SearchInput
                      placeholder="Busca y postula."
                      id="searchText"
                      onKeyPress={(event: any) =>
                        (event.which === 13 || event.keyCode === 13) &&
                        dashboardBloc.searchSongsByText()
                      }
                      onChange={({ target: { value } }: any) =>
                        dashboardBloc.handleSearchTextChange(value)
                      }
                    />
                    <IconContainer onClick={dashboardBloc.searchSongsByText}>
                      <MdSearch color="#fff" size={20} />
                    </IconContainer>
                  </InputContainer>
                </SearchContainer>
                <PostAndSuggestions
                  $isSearchViewActive={state.isSearchViewActive}
                >
                  {state.isSearchViewActive ? (
                    <Fragment>
                      <BackIcon onClick={dashboardBloc.closeSearchView}>
                        <MdArrowBack color="#FFF" size={15} />
                      </BackIcon>
                      <PostedContainer>
                        {state.isSearchingSongs ? (
                          <div className="total-center" style={{ margin: 20 }}>
                            <CircularProgress />
                          </div>
                        ) : (
                          <Fragment>
                            {state.foundSongs?.length ? (
                              <div style={{ paddingTop: 10, paddingBottom: 0 }}>
                                {state.foundSongs.map((song, i) => (
                                  <SuggestedTrack
                                    onPressAdd={() =>
                                      selectedSpotBloc.addSongToPlaylist(song)
                                    }
                                    song={song}
                                    key={`sugg_${i}`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <NoResultsContainer>
                                <p className="small-text">
                                  No se encontraron resultados para{' '}
                                  <span className="color-primary">
                                    {state.searchText}
                                  </span>
                                </p>
                              </NoResultsContainer>
                            )}
                          </Fragment>
                        )}
                      </PostedContainer>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Tabs
                        value={state.currentActiveTab}
                        onChange={(_, tabIndex) =>
                          dashboardBloc.changeCurrentTab(tabIndex)
                        }
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        classes={{
                          indicator: 'tabs-indicator',
                        }}
                      >
                        <Tab
                          label="Playlist"
                          classes={getTabsStyle(
                            state.currentActiveTab === DashboardTab.Playlist,
                          )}
                        />
                        <Tab
                          label="Sugerencias"
                          classes={getTabsStyle(
                            state.currentActiveTab === DashboardTab.Suggestions,
                          )}
                        />
                      </Tabs>

                      {state.currentActiveTab === DashboardTab.Playlist ? (
                        <BlocBuilder
                          blocClass={SelectedSpotBloc}
                          builder={([selectedSpotState]) => (
                            <PostedContainer>
                              {selectedSpotState.isLoadingPlaylist ? (
                                <div
                                  className="total-center"
                                  style={{ margin: 20 }}
                                >
                                  <CircularProgress />
                                </div>
                              ) : null}
                              <div>
                                {!selectedSpotState.isLoadingPlaylist ? (
                                  selectedSpotState.currentPlaylist.map(
                                    (item, i) => {
                                      if (!item.publisher) return null;
                                      if (
                                        !filterSongs(
                                          item.song.title,
                                          item.song.artistName,
                                          state.searchText,
                                        )
                                      )
                                        return null;
                                      return (
                                        <PostedTrack
                                          userUID={userState.uid!}
                                          usersWhoLike={item.usersWhoLike}
                                          publishedSongId={item.id}
                                          publisherUID={item.publisher.uid!}
                                          publisherName={item.publisher.name!}
                                          publisherAvatar={
                                            item.publisher.avatar!
                                          }
                                          songId={item.song.id}
                                          songTitle={item.song.title}
                                          songArtistName={item.song.artistName}
                                          songAlbumTitle={item.song.albumTitle}
                                          songThumbnail={item.song.pictureSmall}
                                          onReactionPressed={
                                            selectedSpotBloc.reactToSong
                                          }
                                          onPlayPressed={
                                            selectedSpotBloc.finishCurrentSongAndChangeToNext
                                          }
                                          onDeletePressed={
                                            selectedSpotBloc.removeSongFromPlaylist
                                          }
                                          onReplySongPressed={
                                            dashboardBloc.replyToSong
                                          }
                                          shouldShowAdminOptions={selectedSpotBloc.isCurrentUserAdmin()}
                                          shouldShowPlayNowOption={i === 0}
                                          key={`pv_${item.id}`}
                                        />
                                      );
                                    },
                                  )
                                ) : (
                                  <NoResultsContainer className="total-center">
                                    <p className="small-text">
                                      No hay canciones postuladas. Se
                                      reproducirán las sugerencias
                                    </p>
                                  </NoResultsContainer>
                                )}
                              </div>
                            </PostedContainer>
                          )}
                        />
                      ) : null}

                      {state.currentActiveTab === DashboardTab.Suggestions ? (
                        <PostedContainer>
                          {state.suggestions?.length ? (
                            state.suggestions.map((song, i) => {
                              if (
                                filterSongs(
                                  song.title,
                                  song.artistName,
                                  state.searchText,
                                )
                              )
                                return (
                                  <SuggestedTrack
                                    onPressAdd={() =>
                                      selectedSpotBloc.addSongToPlaylist(song)
                                    }
                                    song={song}
                                    key={`sugg_${i}`}
                                  />
                                );
                              return null;
                            })
                          ) : (
                            <NoResultsContainer className="total-center">
                              <p className="small-text">
                                No se encontraron sugerencias.
                              </p>
                            </NoResultsContainer>
                          )}
                        </PostedContainer>
                      ) : null}
                    </Fragment>
                  )}
                </PostAndSuggestions>
              </ResultsContainer>
            </ContentContainer>
          </OpacityContainer>
          <ToastContainer />
          {isNotMobileScreen && (
            <FooterContainer>
              <Footer />
            </FooterContainer>
          )}
        </Container>
      </ImageMiddleBackground>
    </DashboardLayout>
  );
};

const Container = styled.div``;

const NextSongContainer = styled.div`
  @media (max-width: 490px) {
    display: none;
  }
`;

const OpacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;

const SearchContainer = styled.div`
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  @media (max-width: 1200px) {
    padding-left: 0px;
    width: 550px;
  }
  @media (max-width: 992px) {
    display: none;
  }
  @media (max-width: 500px) {
    padding-left: 0px;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 1200px;
  margin-top: 20px;
  @media (max-width: 1200px) {
    justify-content: center;
    width: 100% !important;
  }
  @media (max-width: 992px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100% !important;
  }
  @media (max-width: 750px) {
    margin-top: 40px;
  }
  @media (max-width: 420px) {
    margin-top: 00px;
  }
`;
interface VideoContainerProps {
  $playerWidth: number;
}

const VideoContainer = styled.div<VideoContainerProps>`
  width: ${props => props.$playerWidth}px;
  margin-left: 20px;
  @media (max-width: 992px) {
    margin-left: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  @media (max-width: 420px) {
    display: none;
  }
`;

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (min-width: 1200px) {
    margin-left: 70px;
  }
  @media (max-width: 1200px) {
    margin-left: 20px;
    max-width: 400px;
  }
  @media (max-width: 992px) {
    margin-left: 0px;
    margin-top: 20px;
  }
  @media (max-width: 500px) {
    width: 100%;
    margin-top: 0px;
  }
`;
const NextText = styled.div`
  font-family: Poppins;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
`;
const InputContainer = styled.div`
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  background-color: #0d1419;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 1200px) {
    max-width: 400px;
  }
  @media (max-width: 992px) {
    margin-left: 0px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 450px) {
    width: 85%;
  }
`;
interface PostAndSuggestionsProps {
  $isSearchViewActive?: boolean;
}

const PostAndSuggestions = styled.div<PostAndSuggestionsProps>`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 200px);
  @media (max-width: 1200px) {
    max-width: 500px;
  }
  @media (max-width: 992px) {
  }
  @media (max-width: 450px) {
    width: 100%;
    margin-top: ${props => (props.$isSearchViewActive ? '0px' : '-48px')};
  }
`;
const IconContainer = styled.div`
  width: 50px;
  height: 53px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #111a1f;
  cursor: pointer;
  @media (max-width: 992px) {
    background-color: #000;
  }
`;
const SearchInput = styled.input`
  max-width: 500px;
  width: 100%;
  height: 40px;
  background-color: #0d1419;
  color: #fff;
  border: none;
  outline: none;
  padding-left: 30px;
  margin-left: 3px;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  @media (max-width: 992px) {
    background-color: transparent;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const BackIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 30px;
  width: 25px;
  height: 25px;
  background-color: #ea4335;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  z-index: 1;
  box-shadow: 0px 1px 8px #ffffff80;
  transition-duration: 0.3s;
  :hover {
    background-color: #202020;
  }
`;

const PostedContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 63px);
  overflow-y: auto;
  overflow-x: hidden;
  overflow-anchor: none;
  padding-top: 10px;
  @media (max-width: 992px) {
    padding-bottom: 50px;
    margin-bottom: 20px;
  }
  @media (max-width: 420px) {
    margin-bottom: 0px;
  }
`;

const NoResultsContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: white;
`;

const FooterContainer = styled.div``;

const DashboardConnectedToBloc = withBloc(Dashboard, () =>
  BlocsFactory.dashboardBloc(),
);

export default DashboardConnectedToBloc;
