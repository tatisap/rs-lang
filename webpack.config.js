import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { merge } from 'webpack-merge';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const commonConfig = {
  entry: path.resolve(dirname, './src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(dirname, './dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, './src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(dirname, './src/assets/favicon.ico'),
          to: path.resolve(dirname, 'dist'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

const osName = os.type();
let browserName;
switch (osName) {
  case 'Linux':
    browserName = 'google-chrome';
    break;
  case 'Darwin':
    browserName = 'Google Chrome';
    break;
  default:
    browserName = 'chrome';
    break;
}

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(dirname, './dist'),
    open: {
      app: {
        name: browserName,
      },
    },
  },
};

const prodConfig = {
  mode: 'production',
};

export default ({ mode }) => {
  const isDevelopmentMode = mode === 'dev';
  const additionalConfig = isDevelopmentMode ? devConfig : prodConfig;

  return merge(commonConfig, additionalConfig);
};
