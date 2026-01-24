const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const outputPath = path.resolve(__dirname, isProd ? "docs" : "dist");

  return {
    entry: "./src/js/main.js",
    output: {
      path: outputPath,
      filename: isProd ? "bundle.[contenthash].js" : "bundle.js",
      clean: isProd ? { keep: /STATUS\.md/ } : true,
      publicPath: isProd ? "./" : "auto",
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          type: "javascript/esm",
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?)$/i,
          type: "asset",
          generator: { filename: "assets/[name][ext]" },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./src/assets/favicon.svg",
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "styles.[contenthash].css" })]
        : []),
    ],
    devServer: {
      static: outputPath,
      port: 3000,
      open: true,
      hot: true,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:3001",
          changeOrigin: true,
          pathRewrite: { "^/api": "" },
        },
      ],
    },
    devtool: isProd ? "source-map" : "eval-source-map",
  };
};
