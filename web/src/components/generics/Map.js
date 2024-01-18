import React from "react"
// import { compose, withProps } from "recompose"
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"


// let keyFaltaUno ="AIzaSyBYMpXjBKuzCJAeivAbJi4X1RenRQATZbU"
// let keyWateke = "AIzaSyD7YJwn3VhVG8iqhwy1jifk4RnSBUkGMUE"
const Map =
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={props.zoom ? props.zoom : 14}
      defaultCenter={{ lat: 10.4805937, lng: -66.90360629999998 }}
      center={{ lat: props.latitude ? props.latitude : 10.4805937, lng: props.longitude ? props.longitude : -66.90360629999998 }}
    >
      <Marker
        position={{ lat: props.latitude ? props.latitude : 10.4805937, lng: props.longitude ? props.longitude : -66.90360629999998 }}
        draggable={props.draggable ? true : false}
        onDragEnd={props.onDragEnd}
      />
    </GoogleMap>
  ));


export default Map;
