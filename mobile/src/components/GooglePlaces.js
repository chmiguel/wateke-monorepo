'use strict';

import React, { PureComponent } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as config from '../constants/config'
import strings from '../constants/translations'

class GooglePlaces extends PureComponent {
	render() {
		return (
			<GooglePlacesAutocomplete
				placeholder={strings.searchCity}
				minLength={2} // minimum length of text to search
				autoFocus={false}
				returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
				listViewDisplayed={true}   // true/false/undefined
				fetchDetails={true}
				renderDescription={row => row.description} // custom description render
				onPress={this.props.onPress}
				getDefaultValue={() => ''}
				query={{
					// available options: https://developers.google.com/places/web-service/autocomplete
					key: 'AIzaSyDoMpyoXdQRFNYO0JiO36lZw7nxsfQanrY',
					language: 'es', // language of the results
					types: '(cities)' // default: 'geocode'
				}}
				styles={{
					textInputContainer: {
						width: '100%',
						backgroundColor: 'transparent',
						borderTopWidth: 0,
						borderBottomWidth: 1,
						borderColor: config.accentColor,
						borderBottomColor: config.accentColor,
						minHeight: 42,
						paddingRight: 0,
						paddingLeft: 0,
						marginRight: 0,
						marginLeft: 0
					},
					textInput: {
						height: 40,
						width: '100%',
						marginTop: 0,
						marginRight: 0,
						marginLeft: 0,
						backgroundColor: 'transparent',
						color: config.primaryDarkTextColor,
					},
					description: {
						fontWeight: 'bold'
					},
					predefinedPlacesDescription: {
						color: '#1faadb'
					},
					listView: {
						backgroundColor: 'white',
						elevation: 2,
						borderRadius: 4,
						marginTop: 5
					}
				}}
				currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
				currentLocationLabel="Buscar mi ubicación actual"
				nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
				GoogleReverseGeocodingQuery={{
					// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
				}}
				GooglePlacesSearchQuery={{
					// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
					rankby: 'distance',
					types: 'cities'
				}}

				filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
				//predefinedPlaces={[homePlace, workPlace]}

				debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
			//renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
			//renderRightButton={() => <Text>Custom text after the input</Text>}
			/>
		);
	}
}


export default GooglePlaces;