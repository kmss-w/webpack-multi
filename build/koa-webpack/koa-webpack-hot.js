/*!
 * project name: www.cos
 * name:         koa-webpack-hot.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const PassThrough = require('stream').PassThrough;
const hotMiddleware = require('webpack-hot-middleware');

module.exports = (compiler, opts) => {
  const middleware = hotMiddleware(compiler, opts);

  return async (ctx, next) => {
    let stream = new PassThrough();

    await middleware(
      ctx.req,
      {
        write: stream.write.bind(stream),
        writeHead: (status, headers) => {
          context.body = stream;
          ctx.status = status;
          context.set(headers);
        }
      },
      next
    );
  };
};

