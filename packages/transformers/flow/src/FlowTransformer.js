// @flow
import type {PackageJSON} from '@parcel/types';
import {Transformer} from '@parcel/plugin';

export default (new Transformer({
  async loadConfig({config, options}) {
    // if (!config.isSource) {
    //   return false;
    // }
    //
    // // Only run flow if `flow-bin` is listed as a dependency in the root package.json
    // let pkg: ?PackageJSON = (
    //   await config.getConfigFrom(options.projectRoot + '/index', [
    //     'package.json',
    //   ])
    // )?.contents;

    let shouldStripFlow = true;
    // pkg?.dependencies?.['flow-bin'] != null ||
    // pkg?.devDependencies?.['flow-bin'] != null;

    if (shouldStripFlow) {
      config.addDevDependency({
        specifier: 'flow-remove-types',
        resolveFrom: options.projectRoot + '/index',
      });
    }
    return shouldStripFlow;
  },

  async transform({asset, config, options}) {
    if (!config) {
      return [asset];
    }

    let [code, flowRemoveTypes] = await Promise.all([
      asset.getCode(),
      options.packageManager.require(
        'flow-remove-types',
        options.projectRoot + '/index',
        {
          shouldAutoInstall: options.shouldAutoInstall,
          saveDev: true,
        },
      ),
    ]);

    // This replaces removed code sections with spaces, so all source positions
    // remain valid and no sourcemap is needed.
    asset.setCode(
      flowRemoveTypes(code, {
        // node_modules/react-native/Libraries/Utilities/DevSettings.js doesn't contain a @flow comment
        all: asset.filePath.includes('node_modules/react-native/'),
      }).toString(),
    );

    return [asset];
  },
}): Transformer);
