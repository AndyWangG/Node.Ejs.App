var express = require('express');
var router = express.Router();
var menuBll = require('../BLL/menuBll');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.aaa) {
        req.session.aaa = 1;
    }
    else {
        req.session.aaa++;
    }
    res.cookie("name", "myname");
    menuBll.getMenuList(function (itemList) {
        res.render('index', {
            title: '首页' + req.session.aaa + req.cookies.name,
            layout: 'layout.html',
            itemList: itemList
        });
    });
});

module.exports = router;
