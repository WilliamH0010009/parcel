// @flow strict-local
import type {FilePath} from '@parcel/types';
import type {FileSystem} from '@parcel/fs';
import type {IncomingMessage, ServerResponse} from 'http';

import path from 'path';
import {Reporter} from '@parcel/plugin';
import {createHTTPServer} from '@parcel/utils';

let server;

function generateManifest(appJson: {[string]: mixed}) {
  return {
    ...appJson,

    _internal: {
      isDebug: false,
      projectRoot: '/Users/niklas/Desktop/parcel/packages/examples/expo',
      dynamicConfigPath: null,
      staticConfigPath:
        '/Users/niklas/Desktop/parcel/packages/examples/expo/app.json',
      packageJsonPath:
        '/Users/niklas/Desktop/parcel/packages/examples/expo/package.json',
    },
    sdkVersion: '42.0.0',
    platforms: ['ios', 'android', 'web'],
    developer: {
      tool: 'expo-cli',
      projectRoot: '/Users/niklas/Desktop/parcel/packages/examples/expo',
    },
    packagerOpts: {
      scheme: null,
      hostType: 'lan',
      lanType: 'ip',
      dev: true,
      minify: false,
      urlRandomness: null,
      https: false,
    },
    mainModuleName: 'entry.js',
    __flipperHack: 'React Native packager is running',
    debuggerHost: '192.168.1.198:19000',
    logUrl: 'http://192.168.1.198:19000/logs',
    hostUri: '192.168.1.198:19000',

    bundleUrl: 'http://192.168.1.198:1234/entry.js',
    iconUrl: 'http://192.168.1.198:19000/assets/icon.png',
  };
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  inputFS: FileSystem,
  projectRoot: FilePath,
) {
  console.log(req.url);
  const appJson = JSON.parse(
    await inputFS.readFile(path.join(projectRoot, 'app.json'), 'utf8'),
  );
  res.end(JSON.stringify(generateManifest(appJson)));
}

export default (new Reporter({
  async report({event, options, logger}) {
    switch (event.type) {
      case 'watchStart': {
        let serveOptions = options.serveOptions;
        if (serveOptions === false) {
          return;
        }
        server = await createHTTPServer({
          cacheDir: options.cacheDir,
          https: serveOptions.https,
          inputFS: options.inputFS,
          listener: (req, res) => {
            // $FlowFixMe(incompatible-call)
            handleRequest(req, res, options.inputFS, options.projectRoot);
          },
          outputFS: options.outputFS,
          host: serveOptions.host,
        });
        server.server.listen(19000, serveOptions.host);
        logger.info({
          message: 'expo server running at port 19000',
        });
        server.server.once('error', (err: Error) => {
          logger.error({
            message: (err.message: string),
          });
        });
        break;
      }

      case 'watchEnd':
        if (server != null) {
          await server.stop();
        }
        break;
    }
  },
}): Reporter);
