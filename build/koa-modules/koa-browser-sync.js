/*!
 * project name: www.cos
 * name:         koa-browser-sync.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/18
 */

'use strict';

const streamInjecter = require('stream-injecter');
const browserSync = require('browser-sync').create();

module.exports = opts => {
  opts = opts || {};
  opts.init = opts.init || false;
  opts.debugInfo = opts.debugInfo || false;

  let bs = null;

  return (ctx, next) => {
    return next().then(() => {
      if (opts.init) {
        if (!bs) {
          return new Promise((resolve, reject) => {
            return new browserSync.init(opts, (err, instance) => {
              if (err) {
                return reject(err);
              }

              bs = instance;

              return resolve(bs.getOption('snippet'));
            });
          });
        }

        return bs.getOption('snippet');
      }

      return process.env.BROWSERSYNC_SNIPPET;
    }).then(snippet => {
      if (!snippet) {
        return;
      }

      if (!(ctx.response.type && ~ctx.response.type.indexOf("text/html"))) {
        return;
      }

      // Buffer
      if (Buffer.isBuffer(ctx.body)) {
        ctx.body = ctx.body.toString();
      }

      // String
      if (typeof ctx.body === 'string') {
        if (ctx.body.match(/client\/browser-sync-client/)) return;
        ctx.body = ctx.body.replace(/<\/body>/, snippet + '</body>');
      }

      // Stream
      if (ctx.body && typeof ctx.body.pipe === 'function') {
        var injecter = new streamInjecter({
          matchRegExp: /(<\/body>)/,
          inject:      snippet,
          replace:     snippet + '$1',
          ignore:      /client\/browser-sync-client/
        });

        var size = +ctx.response.header['content-length'];

        if (size) {
          ctx.set('Content-Length', size + Buffer.byteLength(snippet));
        }

        ctx.body = ctx.body.pipe(injecter);
      }
    });
  };
};
 
