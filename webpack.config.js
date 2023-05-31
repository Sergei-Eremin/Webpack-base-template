const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const pages = ['index']; // именование страниц

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    open: ['/index'],
  },
  // entry: {
  //   index: path.resolve(__dirname, './src/pages/index', 'index.ts'),
  // },
  entry: pages.reduce((config, page) => {
    config[page] = `./src/pages/${page}`;
    return config;
  }, {}),
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name]/index.[contenthash].js',
    assetModuleFilename: 'assets/[name][contenthash][ext]',
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'src/pages/index', 'index.html'),
    // }),
    new MiniCssExtractPlugin({
      filename: '[name]/style.[contenthash].css',
    }),
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `./src/pages/${page}/index.html`,
          filename: `./${page}/index.html`,
          chunks: [page],
        }),
    ),
  ),
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: devMode
          ? []
          : [
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: [0.65, 0.9],
                    speed: 4,
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  webp: {
                    quality: 75,
                  },
                },
              },
            ],
        type: 'asset/resource',
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.js', '.scss'],
    // alias: {
    //   '@img': path.resolve(__dirname, 'src/img'),
    //   '@style': path.resolve(__dirname, 'src/style'),
    // },
  },
};
