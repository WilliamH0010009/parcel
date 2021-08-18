// @flow strict-local

import path from 'path';
import {Runtime} from '@parcel/plugin';
import {loadConfig} from '@parcel/utils';

const CODE = `
import 'react-native/Libraries/polyfills/console.js';
import 'react-native/Libraries/polyfills/error-guard.js';
import 'react-native/Libraries/polyfills/Object.es7.js';
import 'react-native/Libraries/Core/InitializeCore.js';
`;

export default (new Runtime({
  async apply({bundle, options}) {
    // return {
    //   filePath: path.join(options.projectRoot, 'index'),
    //   code: CODE,
    //   isEntry: true,
    // };
  },
}): Runtime);
