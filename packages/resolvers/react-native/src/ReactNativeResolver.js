// @flow

// import type {FilePath} from '@parcel/types';

// import path from 'path';
// import nullthrows from 'nullthrows';

import {Resolver} from '@parcel/plugin';
import NodeResolver from '@parcel/node-resolver-core';
// import {glob} from '@parcel/utils';

const NODE_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'json'];
function getReactNativeInfixes() {
  // TODO various envs
  return ['android', 'native', ''];
}

function* crossProduct(a, b) {
  for (let aValue of a) {
    for (let bValue of b) {
      if (aValue.length === 0) {
        yield `${bValue}`;
      } else {
        yield `${aValue}.${bValue}`;
      }
    }
  }
}

// const SCALE_REGEX = /^(.+?)(@([\d.]+)x)?\.\w+*$/;

export default (new Resolver({
  async resolve({dependency, options, specifier}) {
    const resolver = new NodeResolver({
      fs: options.inputFS,
      projectRoot: options.projectRoot,
      extensions: [...crossProduct(getReactNativeInfixes(), NODE_EXTENSIONS)],
      mainFields: ['source', 'browser', 'module', 'main'],
    });

    let result = await resolver.resolve({
      filename: specifier,
      specifierType: dependency.specifierType,
      parent: dependency.resolveFrom,
      env: dependency.env,
      sourcePath: dependency.sourcePath,
    });

    //     if (
    //       result != null &&
    //       result.filePath &&
    //       result.filePath?.endsWith('.png')
    //     ) {
    //       const basename = removeExtension(result.filePath);
    //       const g = basename + '@*x.png';
    //       result.invalidateOnFileCreate?.push({
    //         glob: g,
    //       });
    //       let otherFiles = (
    //         await glob(g, options.inputFS, {
    //           deep: false,
    //           onlyFiles: true,
    //         })
    //       ).map(f => {
    //         let [, , scale] = nullthrows(path.basename(f).match(SCALE_REGEX));
    //         return scale;
    //       });

    //       return {
    //         filePath: basename + '.js',
    //         code: `

    // module.exports = require("react-native/Libraries/Image/AssetRegistry").registerAsset({
    //   __packager_asset: true,
    //   httpServerLocation: ${JSON.stringify('/')},
    //   width: ${630},
    //   height: ${258},
    //   scales: ${JSON.stringify([1, ...otherFiles])}
    //   hash: "abc",
    //   name: ${JSON.stringify(basename)},
    //   type: "png",
    //   fileHashes: ["abc"],
    // });`,
    //       };
    //     }

    return result;
  },
}): Resolver);

// function removeExtension(v: FilePath) {
//   return v.substring(0, v.lastIndexOf('.'));
// }
