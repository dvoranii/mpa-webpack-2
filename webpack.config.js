import path from "path";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import Dotenv from "dotenv-webpack";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.resolve(__dirname, "dist");
const templatePath = path.resolve(__dirname, "src", "templates");

const pages = ["home", "about", "contact"];

export default (env, argv) => {
  const isProduction = argv.mode === "production";

  const htmlPluginsInstances = pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(templatePath, `${page}.html`),
        filename: `${page}.html`,
        chunks: ["global", page],
      })
  );

  const plugins = [
    ...htmlPluginsInstances,
    new MiniCssExtractPlugin({
      filename: isProduction
        ? "styles/[name].[contenthash].css"
        : "styles/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src", "assets"), to: "assets" },
      ],
    }),
    new Dotenv({
      path: `./.env.${argv.mode}`,
    }),
  ];

  if (isProduction) {
    plugins.push(
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  }

  return {
    entry: pages.reduce(
      (entries, page) => {
        entries[page] = path.resolve(__dirname, "src", "scripts", `${page}.js`);
        return entries;
      },
      { global: path.resolve(__dirname, "src", "scripts", "global.js") }
    ),

    output: {
      filename: isProduction
        ? "scripts/[name].[contenthash].js"
        : "scripts/[name].js",
      path: buildPath,
      clean: true,
    },

    plugins,

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    devtool: isProduction ? false : "source-map",

    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      open: true,
      historyApiFallback: {
        rewrites: [
          { from: /^\/about\/?$/, to: "/about.html" },
          { from: /^\/contact\/?$/, to: "/contact.html" },
          { from: /./, to: "/home.html" },
        ],
      },
    },

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(), // Add the CSS Minimizer Plugin
      ],
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
