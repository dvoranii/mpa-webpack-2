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

const pages = [
  "home",
  "about",
  "contact",
  "quote",
  "specialHandling",
  "sportingGoods",
  "air",
  "truck",
  "ocean",
  "warehouse",
  "404",
];

const camelCaseToKebabCase = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};

export default (env, argv) => {
  const isProduction = argv.mode === "production";

  const htmlPluginsInstances = pages.map((page) => {
    const kebabCasePage = camelCaseToKebabCase(page);
    const chunks = ["global", page];
    if (page === "home") {
      chunks.push("modal");
    }
    return new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(templatePath, `${kebabCasePage}.html`),
      filename: `${kebabCasePage}.html`,
      chunks,
    });
  });

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
        const camelCasePage = page.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );
        entries[camelCasePage] = [
          path.resolve(__dirname, "src", "scripts", `${camelCasePage}.js`),
        ];

        if (page === "home") {
          entries[camelCasePage].push(
            path.resolve(__dirname, "src", "styles", "modal.css")
          );
        }
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
        {
          test: /\.(glsl|vs|fs)$/,
          use: "shader-loader",
          exclude: /node_modules/,
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
          { from: /^\/$/, to: "/home.html" },
          { from: /^\/quote\/?$/, to: "/quote.html" },
          { from: /^\/special-handling\/?$/, to: "/special-handling.html" },
          { from: /^\/sporting-goods\/?$/, to: "/sporting-goods.html" },
          { from: /^\/air\/?$/, to: "/air.html" },
          { from: /^\/truck\/?$/, to: "/truck.html" },
          { from: /^\/ocean\/?$/, to: "/ocean.html" },
          { from: /^\/warehouse\/?$/, to: "/warehouse.html" },
          { from: /./, to: "/404.html" },
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
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
