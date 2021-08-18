// https://github.com/parcel-bundler/parcel/issues/6732
import 'react-native/Libraries/polyfills/console.js';
import 'react-native/Libraries/polyfills/error-guard.js';
import 'react-native/Libraries/polyfills/Object.es7.js';
import 'react-native/Libraries/Core/InitializeCore.js';

import registerRootComponent from 'expo/build/launch/registerRootComponent';

import App from './App';

registerRootComponent(App);
