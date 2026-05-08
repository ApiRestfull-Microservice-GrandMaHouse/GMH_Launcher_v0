const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: false,
      externalDependencies: [
        'kafkajs',
        'mqtt',
        'ioredis',
        'amqplib',
        'amqp-connection-manager',
        '@grpc/grpc-js',
        '@grpc/proto-loader',
        '@nestjs/websockets',
        '@nestjs/websockets/socket-module',
      ],
    }),
  ],
};