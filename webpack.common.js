const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("./package.json");

module.exports = {
    entry: {
        index: "./src/script/index.js",
        item: "./src/script/item.js",
        jual: "./src/script/jual.js",
        vendor: Object.keys(package.dependencies),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            chunks: ["vendor", "index"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/item.html",
            filename: "item.html",
            chunks: ["vendor", "item"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/jual.html",
            filename: "jual.html",
            chunks: ["vendor", "jual"]
        })
    ]
};