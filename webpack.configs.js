var path = require('path')
  , webpack = require('webpack')
  , pkg = require('./package.json');

var compress = new webpack.optimize.UglifyJsPlugin();

var prodDefine = new webpack.DefinePlugin({
      "process.env": { 
        "NODE_ENV": JSON.stringify('production') }
    });

var banner = new webpack.BannerPlugin( 
      'v' + JSON.stringify(pkg.version) + ' | (c) ' + (new Date).getFullYear() + ' Jason Quense | '
      + 'https://github.com/jquense/react-widgets/blob/master/License.txt'
      , { entryOnly : true });


var loaders = [
  { test: /\.css$/,  loader: "style-loader!css-loader" },
  { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
  { 
    test: /\.jsx$|\.js$/, 
    loader: 'babel-loader', 
    exclude: /node_modules/,
    query: pkg.babel
  }
];

module.exports = {

  to5Config: pkg.babel,

  browser: {

    entry: './index.js',

    output: {
      path: path.join(__dirname, './dist'),
      filename: 'react-widgets.js',
      library:  'ReactWidgets',
      libraryTarget: 'this'
    },

    externals: {
      globalize: 'Globalize',
      react:  'React'
    },

    plugins: [
      prodDefine, banner, compress
    ],
  },

  dev: {
    devtool: 'source-map',
    entry: './example/example.jsx',
    output: {
      filename: 'example.js',
      path: path.join(__dirname, './example'),
      publicPath: 'example/'
    },
    
    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      loaders: loaders
    },
  },

  docs: {
    devtool: 'source-map',

    entry: './docs/components/docs.jsx',
    
    output: {
      path: path.join(__dirname, './docs'),
      filename: 'docs.js',
      publicPath: '/docs'
    },

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    externals: {
      react:  'window.React'
    },

    module: {
      loaders: loaders.concat([
          { test: /\.json$/, loader: "json" }
        ])
    },

    plugins: [
      banner,
      new webpack.DefinePlugin({
        '__VERSION__': JSON.stringify(pkg.version),
        "process.env": {
          "NODE_ENV": JSON.stringify('development') }
      })
    ],
  },

  test: {
    devtool: 'inline-source-map',
    cache: true,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: loaders.concat([
        { test: /sinon-chai/, loader: "imports?define=>false" }
      ])
    },
    //plugins: [ ProdDefine ]
  }
}