import React from 'react';
import styled from 'styled-components';

const Error = styled.span`
  color: red;
  font-size: 14px;
  padding-left: 3px;
`;

const Container = styled.div`
  background-color: grey;
`;
const LoadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderContainer = styled.div`
  background-color: #404040;
  padding: 10px;
  border-radius: 4px;
`;

export default class ImagePicker extends React.PureComponent {
  _handleChange = ({ target }) => {
    if (target.files && target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        // this.setState({filename: target.files[0].name, img: e.target.result})
        if (this.props.onChange) {
          this.props.onChange({
            [this.props.fieldName]: target.files[0],
            [this.props.fieldName + '_data']: e.target.result,
          });
        }
      };

      reader.readAsDataURL(target.files[0]);
    }
  };

  render() {
    return (
      <div>
        <Container
          role="button"
          tabIndex="-1"
          style={this.props.style}
          className="opacitytotal-center"
          onClick={() => {
            document.getElementById(this.props.fieldName).click();
          }}
        >
          {this.props.value ? (
            <LoadedImage src={this.props.value} alt="" />
          ) : null}{' '}
          {!this.props.value && this.props.placeholder ? (
            <PlaceholderContainer className="placeholder-container">
              <p className="bold-text small-text white-text">
                {this.props.placeholder}
              </p>
            </PlaceholderContainer>
          ) : null}
          <input
            accept="image/png,image/jpg,image/jpeg"
            onChange={this._handleChange}
            type="file"
            id={this.props.fieldName}
            className="file-input-update"
            style={{ display: 'none' }}
          />
        </Container>
        <Error>{this.props.error}</Error>
      </div>
    );
  }
}
