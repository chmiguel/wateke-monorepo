import React from 'react';
import {View, FlatList} from 'react-native';
import {SongVM} from '../../../web/src/core/domain/music/Music';
import TrackItem from './TrackItem';

type SuggestionsListProps = {
  suggestions: SongVM[];
  onPressPost: (song: SongVM) => void;
};

const SuggestionsList: React.FC<SuggestionsListProps> = props => {
  const renderSongItem = ({item}: {item: SongVM}) => {
    return <TrackItem onPressPost={props.onPressPost} item={item} />;
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={props.suggestions}
        renderItem={renderSongItem}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      />
    </View>
  );
};

export default SuggestionsList;
