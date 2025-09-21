import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import styled from 'styled-components'
import TextField from '@mui/material/TextField';

const Error = styled.span`
    color: #ea4335;
    font-size: 14px;
    padding-left: 3px;
`


class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = address => {
    this.setState({ address });
    this.props.onSelect(address, { lat: () => { return null }, lng: () => { return null } }, null)
  };

  handleSelect = address => {
    this.setState({
      address
    })
    geocodeByAddress(address)
      .then(results => this.props.onSelect(address, results[0].geometry.location, results))
      .catch(error => console.error('Error', error));
  };

  render() {
    return (
      <div>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <TextField
                {...getInputProps({
                  label: 'Ubicación del spot',
                  placeholder: 'Calle, Avenida, Ciudad...',
                })}
                value={this.state.address}
                fullWidth
              />
              <div className="autocomplete-container">
                {loading && <div>Buscando...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </PlacesAutocomplete>
        <Error>{this.props.error}</Error>
      </div>
    );
  }
}

export default LocationSearchInput;