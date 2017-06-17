var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoose = require("mongoose");
var mongoStore = require("connect-mongo")(session);
mongoose.connect("mongodb://localhost");

var bodyParser = require('body-parser');
var ejs = require('ejs');
var index = require('./routes/index');
var users = require('./routes/users');
// 添加layout支持
var expressLayouts = require('express-ejs-layouts');
var app = express();


// 视图引擎安装 使用ejs 引擎  html文件渲染视图
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(expressLayouts);// 添加layout支持


//设置网站favicon.icon，放在这里是为了不让这种请求记录在日志中
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//由于Session需要加密session_id，所以一定要传入一个密钥字符串（任意）来加密
app.use(cookieParser());
app.use(session({
        secret: 'SERVER_NODE_JS',
        name: 'COOKIE_ID',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: {maxAge: 60 * 60 * 1000},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: true,
        store: new mongoStore({   //创建新的mongodb数据库
            url: 'mongodb://localhost/NodeAppSession'
        })
    })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: "500"});
});

module.exports = app;
