/*!
 * project name: www.cos
 * name:         koa-webpack-dev.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const devMiddleware = require('webpack-dev-middleware');

module.exports = (compiler, opts) => {
  const dev = devMiddleware(compiler, opts);

  const waitMiddleware = () => {
    return new Promise((resolve, reject) => {
      dev.waitUntilValid(() => {
        resolve(true);
      });

      compiler.plugin('failed', err => {
        reject(err);
      });
    });
  };

  return {
    webpackDevMidd: () => {
      return async (ctx, next) => {
        await waitMiddleware();

        await new Promise((resolve, reject) => {
          dev(
            ctx.req,
            {
              end: content => {
                ctx.body = content;
                resolve();
              },
              setHeader: ctx.set.bind(ctx),
              locals: ctx.state
            },
            () => resolve(next())
          );
        });
      }
    },
    dev: dev
  };
};
 
