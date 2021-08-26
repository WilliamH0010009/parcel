// @flow strict-local

import {Runtime} from '@parcel/plugin';

// https://github.com/facebook/metro/blob/af23a1b27bcaaff2e43cb795744b003e145e78dd/packages/metro/src/Assets.js#L187-L228

export default (new Runtime({
  apply({bundle, bundleGraph}) {
    if (bundle.type !== 'js') {
      return;
    }

    let assets = [];
    bundle.traverse(node => {
      if (node.type !== 'dependency') {
        return;
      }

      let dependency = node.value;
      let resolution = bundleGraph.getResolvedAsset(dependency, bundle);
      if (
        resolution != null &&
        (resolution.type === 'png' ||
          resolution.type === 'jpg' ||
          resolution.type === 'jpeg')
      ) {
        let referencedBundle = bundleGraph.getReferencedBundle(
          dependency,
          bundle,
        );
        if (referencedBundle == null) {
          return;
        }

        let name = referencedBundle.name;
        assets.push({
          // TODO
          filePath: __filename,
          dependency,
          env: {sourceType: 'module'},
          code: `
module.exports = require("react-native/Libraries/Image/AssetRegistry").registerAsset({
  __packager_asset: true,
  httpServerLocation: ${JSON.stringify('/')},
  width: ${630},
  height: ${258},
  scales: [${1}],
  hash: ${JSON.stringify(resolution.id)},
  name: ${JSON.stringify(name.substring(0, name.lastIndexOf('.')))},
  type: ${JSON.stringify(resolution.type)},
  fileHashes: [${JSON.stringify(resolution.id)}],
});`,
        });
      }
    });
    return assets;
  },
}): Runtime);
