// @flow

import {Resolver} from '@parcel/plugin';
import NodeResolver from '@parcel/node-resolver-core';

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

export default (new Resolver({
  resolve({dependency, options, specifier}) {
    const resolver = new NodeResolver({
      fs: options.inputFS,
      projectRoot: options.projectRoot,
      extensions: [...crossProduct(getReactNativeInfixes(), NODE_EXTENSIONS)],
      mainFields: ['source', 'browser', 'module', 'main'],
    });

    return resolver.resolve({
      filename: specifier,
      specifierType: dependency.specifierType,
      parent: dependency.resolveFrom,
      env: dependency.env,
      sourcePath: dependency.sourcePath,
    });
  },
}): Resolver);
