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
        expense: "./src/script/expense.js",
        histJual: "./src/script/hist-jual.js",
        histExpense: "./src/script/hist-expense.js",
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
        }),
        new HtmlWebpackPlugin({
            template: "./src/expense.html",
            filename: "expense.html",
            chunks: ["vendor", "expense"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/hist-jual.html",
            filename: "hist-jual.html",
            chunks: ["vendor", "histJual"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/hist-expense.html",
            filename: "hist-expense.html",
            chunks: ["vendor", "histExpense"]
        })
    ]
};