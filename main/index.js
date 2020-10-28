import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { clearCache } from '../lib/utils';
import '../client/components/App';

export default () => {
  const pathPublic = path.resolve(__dirname, '../public');
  const template = fs.readFileSync(path.resolve(__dirname, pathPublic, 'html/index.html'), 'utf8');

  const app = fastify({
    logger: {
      prettyPrint: true,
      level: 'error',
    },
  });

  app.register(fastifyStatic, { root: pathPublic, wildcard: false });
  app.get('/*', async (request, reply) => {
    const mode = process.env.NODE_ENV || 'development';
    const isDevelopment = mode === 'development';

    const appPath = path.resolve(__dirname, '../client/components/App.js');
    if (isDevelopment) {
      clearCache(require.resolve(appPath), { ignoreRegex: /context/ });
    }
    const App = require(appPath).default; // eslint-disable-line
    const renderedComponent = renderToString(<App />);
    const html = template.replace('{{content}}', renderedComponent);

    reply.type('text/html');
    reply.send(html);
  });

  return app;
};
