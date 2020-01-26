/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import MapView from 'react-native-maps';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { DestinationButton } from './components/DestinationButton'
import { CurrentLocationButton } from './components/CurrentLocationButton'
import Driver from './components/Driver'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null
    }
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let statusWhenInUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    let statusAlways = await check(PERMISSIONS.IOS.LOCATION_ALWAYS)

    if (statusAlways !== RESULTS.GRANTED && statusWhenInUse !== RESULTS.GRANTED) {
      console.log("Permission to access location was denied");
      return;
    }
    Geolocation.getCurrentPosition(this._setLocation, this._setError, { enableHighAccuracy: true });
  }

  _setLocation = (location) => {
    let thisRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
    };

    this.setState({ region: thisRegion });
  }

  _setError = (error) => {
    console.error(error)
  }

  _centerMap() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;

    this.map.animateToRegion({
      latitude, longitude, latitudeDelta, longitudeDelta
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <DestinationButton />
        <CurrentLocationButton cb={() => { this._centerMap() }} />

        <MapView
          showsUserLocation={true}
          showsCompass={true}
          rotateEnabled={false}
          initialRegion={this.state.region}
          style={styles.map}
          ref={(map) => this.map = map}>
          <Driver driver={{ uid: 'null', location: { latitude: 55.91304, longitude: -4.21892 } }} />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

