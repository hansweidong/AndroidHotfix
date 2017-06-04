/**
 * Created by Huangliang on 2017/5/24.
 */
var express    = require('express');
var router     = express.Router();
var User       = require('./controller');
var http       = require('http');
var path       = require('path');


/**
 * Swig渲染引擎加载页面路由
 */
router.get('/',User.createAcess)

router.get('/test',(req,res)=>{
    return res.render('test')
})

/**
 * 根据cookie判断用户是否具有访问权限
 */
router.get('/update',(req,res)=>{
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        let parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(Cookies.token);
    if(!Cookies.token){
        User.getToken().then((result)=>{
            console.log(result)
            res.cookie('token', result.md5);
            return res.render('login',{title:'登陆界面'})
        })
    }
    User.judge(Cookies.token).then((acess)=>{
        if(acess.acess == 'success'){
        
            return res.render('update',{title:'管理界面'})
        }else{
            User.getToken().then((result)=>{
                console.log(result)
                res.cookie('token', result.md5);
                return res.render('login',{title:'登陆界面'})

            })
        }
    })
})


router.get('/acesstoken',User.createAcess);

router.get('/download/:fileName',User.downfile);

router.get('/andfix/present',User.queryVersion);

router.get('/hotfix/version',User.query);

router.post('/login',User.login);

router.post('/upload',User.upload);

router.get('/reset',User.reset)




module.exports = router;

