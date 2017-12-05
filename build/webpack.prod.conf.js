/*!
 * project name: www.cos
 * name:         webpack.prod.conf.js
 * version:      v0.0.1
 * author:       w.xuan
 * email:        pro.w.xuan@.gmail.com
 * date:         2017/10/12
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const SpritesmithPlugin = require('webpack-spritesmith');

const utils = require('./utils');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');

const env = process.env.NODE_ENV === 'testing' ?
  require('./config/test.env') :
  config.build.env;

const pkgCinfig = require('../package.json');
const bannerInfo = `project name: ${pkgCinfig.name}
description:  ${pkgCinfig.description}
version:      ${pkgCinfig.version}
author:       ${pkgCinfig.author}`;

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  resolve: {
    modules: ['node_modules', 'src/styles']
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true
      },
      sourceMap: false
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      allChunks: true,
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {safe: true}
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: process.env.NODE_ENV === 'testing'
    //     ? 'index.html'
    //     : config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),

    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),

    // code banner information
    new webpack.BannerPlugin({banner: bannerInfo, entryOnly: true}),

    // this repeat?
    new AssetsPlugin({path: config.build.assetsRoot}),
    new ManifestPlugin(),

    new ImageMinPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../src/assets/sprite'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, '../src/styles/sprite.png'),
        css: path.resolve(__dirname, '../src/styles/_img.scss')
      },
      apiOptions: {
        cssImageRef: "~sprite.png"
      }
    })
  ]
});

if (config.build.productionWebp) {
  const WebPWebpackPlugin = require('webp-webpack-plugin');

  webpackConfig.plugins.push(
    new WebPWebpackPlugin({
      match: /(jpe?g|png|gif)$/,
      webp: {
        quality: 80,
        inject: true, // inject the default runtime code
        injectCode: '' // inject your code
      }
    })
  );
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
          config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

let pagePath = utils.resolve('src/views');
let pages = utils.pages(pagePath + '/**/*.html');

for (let entryName in pages) {
  let fileName = path.normalize(pages[entryName]['path']).replace(
    path.normalize(pagePath), ''
  );

  let conf = {
    //filename: entryName + '.html', // html file name
    filename: '../views' + fileName, // html file name
    template: pages[entryName]['path'],
    inject: true, // auto inject static files to html
    // minify: {
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   removeAttributeQuotes: true
    //   // more options:
    //   // https://github.com/kangax/html-minifier#options-quick-reference
    // },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunks: ['manifest', 'vendor', pages[entryName]['chunk']],
    chunksSortMode: 'dependency'
  };

  // entry corresponds to the HTML file (configure multiple, corresponding to an entry through a page chunks)
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackConfig;
