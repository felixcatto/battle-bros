import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';

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
    reply.type('text/html');
    reply.send(template);
  });

  return app;
};
