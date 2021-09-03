// @flow strict-local

import {Namer} from '@parcel/plugin';
import path from 'path';
import nullthrows from 'nullthrows';

export default (new Namer({
  name({bundle}) {
    if (bundle.type === 'png') {
      let asset = nullthrows(bundle.getMainEntry());
      if (asset.pipeline === 'rn-asset') {
        // TODO collisions
        return path.basename(asset.filePath);
      }
    }
  },
}): Namer);
