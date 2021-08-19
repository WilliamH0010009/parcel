// @flow strict-local

import path from 'path';
import {Runtime} from '@parcel/plugin';

const CODE = `
import 'react-native/Libraries/polyfills/console.js';
import 'react-native/Libraries/polyfills/error-guard.js';
import 'react-native/Libraries/polyfills/Object.es7.js';
import 'react-native/Libraries/Core/InitializeCore.js';
`;

export default (new Runtime({
  apply({options}) {
    // TODO not in every bundle
    return {
      filePath: path.join(options.projectRoot, 'index'),
      code: CODE,
      isEntry: true,
    };
  },
}): Runtime);
