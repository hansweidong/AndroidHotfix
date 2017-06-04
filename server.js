/**
 * Created by Huangliang on 2017/5/24.
 */


/**
 * 引入必要模块
 */
let express      = require('express');
let path         = require('path');
let favicon      = require('serve-favicon');
let logger       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let swig         = require('swig');
let debug        = require('debug')('app:server');
let http         = require('http');
let mongoose     = require('mongoose');

/**
 * 启动App
 */
let app     = express();
let port    = 8100;
let routes  = require('./src/router');
let service = require('./src/service');

/**
 * 配置本机存放文件地址
 * @type {string}
 */
express.pkgUrl      = 'C:/Users/huang/Tangpriest/workspace/myapp/tmp/';
express.downloadUrl = 'http://127.0.0.1:8100/download/';


/**
 * mognodb数据库骨架加载器
 */
global.dbHandle  = require('./src/dbBase/dbHandle');
mongoose.connect('mongodb://127.0.0.1/webupdate',(err) => {
    if(err){
        console.log('数据库连接失败 失败原因: ' + err);

    }
    console.log('***********MongoDB链接成功***********');
});

/**
 * 设置HTML模板引擎
 */
app.set('views', path.join(__dirname, './app'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * 配置前端静态Path
 */
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'app/css')));


/**
 * 加载路由
 */
app.use('/',routes);

app.set('port', port);


var server = http.createServer(app);
console.log('***********开始启动服务器***********');


server.listen(port);

console.log('***********服务器启动成功，监听端口号: '+ port +'***********');
