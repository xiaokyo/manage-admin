const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// customize plugins
const AutoGen = require('./plugins/AutoGen')

// proxy
const proxy = require('./src/config/proxy')

const mode = process.env.NODE_ENV
const isDev = mode === 'development' ? true : false
const PUBLIC_PATH = '/'
const PORT = 5503
const BASE_PATH = ''

const devServer = {
  contentBase: path.join(__dirname, 'build'),// 根目录
  compress: true,// 是否压缩
  port: PORT,// 启动端口
  open: true,// 打包好自动启动网页
  openPage: BASE_PATH,
  publicPath: PUBLIC_PATH, // 静态目录
  allowedHosts: ['*'], // 允许的域名
  writeToDisk: true, // 开发环境是否写入文件 output 配置的目录
  historyApiFallback: {
    rewrites: [
      { from: /^\//, to: '/index.html' },// 开发环境下防止404
    ]
  },
  quiet: true, // 静默输出
  proxy
}

const plugins = [// webpack 插件
  new AutoGen(),// 自动生成所需index.js
  new webpack.DefinePlugin({ '_MODE_': JSON.stringify(mode) }),
  // 拷贝文件
  // new CopyPlugin([
  //   { from: 'angular', to: '' },
  // ]),
  // 生成带打包js的html
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './public/index.html',
  }),
  new CleanWebpackPlugin(),// 清理打包的文件
  new MiniCssExtractPlugin({
    // filename: `assets/css/${devMode ? '[name]' : '[name].[hash]'}.css`,
    filename: `[name].[hash:5].css`,
    // chunkFilename: 'assets/css/chunks/[id].css',
    ignoreOrder: true, // Enable to remove warnings about conflicting order
  }),
  new OptimizeCssAssetsPlugin()
]

module.exports = {
  mode: mode === 'test' ? 'production' : mode,
  entry: {// 入口配置
    index: './src/index.js'
  },
  output: {// 输出配置
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash:5].bundle.js',
    publicPath: PUBLIC_PATH
  },
  resolve: {
    alias: {
      config: path.resolve(__dirname, 'src/config'),
      pages: path.resolve(__dirname, 'src/pages'),
      utils: path.resolve(__dirname, 'src/utils'),
      components: path.resolve(__dirname, 'src/components'),
      routers: path.resolve(__dirname, 'src/.cache/routers'),
      apis: path.resolve(__dirname, 'src/.cache/apis'),

      // cache alias
      _apis: path.resolve(__dirname, 'src/apis'),
    }
  },
  module: {
    rules: [// 模块化编译规则
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: /src/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3,
                },
              ],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              [
                'react-css-modules',
                {
                  autoResolveMultipleImports: true, //允许多个样式文件引入且不需要导出变量引用
                  generateScopedName: '[local]--[hash:base64:8]',
                  filetypes: {
                    '.less': {
                      syntax: 'postcss-less',
                    },
                  },
                },
              ],
              [
                "import", {
                  "libraryName": "antd",
                  "libraryDirectory": "es",
                  "style": true // `style: true` 会加载 less 文件
                }
              ]
            ]
          }
        }
      },
      {
        // 第三方样式包的处理
        test: /\.(less|css)$/,
        include: /(node_modules)/, //指定文件夹中的样式文件
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              // modifyVars: {
              //   'primary-color': '#e3a86c',
              //   'link-color': '#e3a86c',
              // },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        exclude: /(node_modules|bower_components)/, //排除文件件
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:8]',
              },
            },
          },
          'less-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, //小于8kg的会进行base64的保存方式导出到js
              name: '[hash].[ext]',
            },
          },
        ],
      },
    ]
  },
  devServer,// 开发配置
  devtool: isDev ? 'source-map' : 'none',
  plugins,// 插件配置
}