var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
      login:'./app/login.jsx',
      main:'./app/main.jsx'
  },
  output: {
        path: path.resolve(__dirname, './app/build'), // 输出文件的保存路径
        filename: '[name].js' // 输出文件的名称
    },

    module: {
            loaders: [{
                    test: /\.jsx?$/,
                    loaders: 'babel-loader',
                    query: {
                        presets: ['react', 'es2015']
                    }
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?modules'
                },
                {
        　　　　　　test: /\.(png|jpg)$/,
        　　　　　　loader: 'url-loader?limit=8192&name=img/[name].[hash:8].[ext]'
        　　　　}
            ]
    },
    plugins:[new webpack.optimize.UglifyJsPlugin()]
   

};