/**
 * Created by Huangliang on 2017/5/24.
 */
let express    = require('express');
let mongoose   = require('mongoose');
let md5        = require('md5');1
let util       = require('util');
let formidable = require('formidable');
let fs         = require('fs');
let path       = require('path');
let crypto     = require('crypto');


/**
 * 前端点击登陆后每次更新数据库中token的md5
 * @param req
 * @param res 返回md5
 */
exports.createAcess = (req,res)=>{
    let Md5   = global.dbHandle.getModel('md5');
    let token = md5(Math.ceil(Math.random()*20));
    let tokenMsg = {
        type:'token',
        md5:token
    }
    Md5.find({ type:'token' },(err,result) => {
        console.log('查询的md5:')
        console.log(result);
        if(err){
            console.log('查询token失败')
            return res.json({
                err:'查询失败',
            })
        }
        if(result && result.length == 0){
            Md5.create(tokenMsg,(err) => {
                if(err){
                    return res.json({
                        err:'创建token失败'
                    })
                }
                console.log('初始化token成功');
                console.log(token);
                res.cookie('token', token, 30);
                return res.render('login')
               /* return res.json({
                    token:token
                })*/
            })
        }
        if(result && result.length == 1){
            Md5.update({_id:result[0]._id},{$set:{'md5':token}},(err)=>{
                if(err){
                    return res.json({
                        err:'更新token失败'
                    })
                }
                console.log('更新token成功')
                console.log(token);
                res.cookie('token', token, 30);
                return res.render('login')
                /*return res.json({
                    token:token
                })*/
            })
        }else{
            return res.json({
                err:'未知宇宙错误'
            })
        }
    })
}





/**
 * 查询数据库中用户的密码、token值
 * @returns {Promise}
 * 返回 md5 password md5（md5 + password）
 */

let getToken = () =>{
    return new Promise((resolve,reject)=>{
        let [Md5,User]  =  [global.dbHandle.getModel('md5'),global.dbHandle.getModel('user')];
        Md5.find({type:'token'},(err,result)=>{
            if(err){
                reject({msg:'查询token失败'})
            }
            if(result && (result.length ==1)){
                User.find({userName:'admin'},(err,item)=>{
                    if(err){
                        reject({msg:'查询token失败'})
                    }
                    if(item && (item.length == 1)){
                        
                        resolve({
                            md5     :result[0].md5,
                            password:item[0].password,
                            token   :md5(item[0].password + result[0].md5)
                        })
                    }else{
                        reject({msg:'查询password失败'})
                    }
                })
            }else{
                reject({msg:'查询token失败'})
            }
        })
    })
}


exports.getToken = () =>{
    return new Promise((resolve,reject)=>{
        let [Md5,User]  =  [global.dbHandle.getModel('md5'),global.dbHandle.getModel('user')];
        Md5.find({type:'token'},(err,result)=>{
            if(err){
                reject({msg:'查询token失败'})
            }
            if(result && (result.length ==1)){
                User.find({userName:'admin'},(err,item)=>{
                    if(err){
                        reject({msg:'查询token失败'})
                    }
                    if(item && (item.length == 1)){
                        resolve({
                            md5     :result[0].md5,
                            password:item[0].password,
                            token   :md5(item[0].password + result[0].md5)
                        })
                    }else{
                        reject({msg:'查询password失败'})
                    }
                })
            }else{
                reject({msg:'查询token失败'})
            }
        })
    })
}



/**
 * 判断客户端存在的token值是否和数据库中存在的token值一样
 * @param token
 * @returns {Promise}
 */
exports.judge = (token) =>{
    return new Promise((resolve,reject)=>{
        getToken().then((msg)=>{
            if(msg.token && (token == msg.token)){
                resolve({
                    acess:'success'
                })
            }else {
                resolve({
                    acess:'failed'
                })
            }
        })
    })
}


/**
 * 判断用户登录
 * @param req
 * @param res
 * @returns {*|string}
 */
exports.login = (req,res)=>{
    console.log(req.body.password);
    if(!req.body.password){return res.json({err:'登陆参数请求不正确'})}
    getToken().then((msg)=>{
        if(msg.msg){
            return res.json({err:msg.msg})
        }
        console.log(msg.token);
        if(req.body.password == msg.token){
            res.cookie('token', msg.token, 30);
            return res.json({
                code:10000,
                msg:'登陆成功'
            })
        }else{
            return res.json({
                code:9999,
                msg:'错误的密码'
            })
        }
    })
}

/**
 * 根据文件地址读取文件的md5
 * @param url
 * @returns {Promise}
 */
let readFileMd5 = (url) =>{
    return new Promise((reslove) => {
        let md5sum = crypto.createHash('md5');
        let stream = fs.createReadStream(url);
        stream.on('data', function(chunk) {
            md5sum.update(chunk);
        });
        stream.on('end', function() {
            let fileMd5 = md5sum.digest('hex');
            reslove(fileMd5);
        })
    })
}

/**
 * 查询当前版本信息
 * @returns {Promise}
 */
let findCurrentVersion = () => {
    let versionCollection = global.dbHandle.getModel('version');
    return new Promise((resolve,reject) =>{
        versionCollection.find({name:'fix'},(err,result)=>{
            if(err){
                reject({err:'DB Error'})
            }
            if(result && result.length == 0){
                resolve({msg:'empty'})
            }
            if(result && result.length == 1){
                resolve(result[0]);
            }
            if(result && result.length >1){
                reject({err:'More Than One Version In DB'})
            }
        })
    })
}




/**
 * 前端上传文件到服务器
 * @param req
 * @param res
 */
exports.upload = (req, res) => {

    //versionCollection是数据库骨架 读取到的是version
    let versionCollection = global.dbHandle.getModel('version');
    //创建formidable对象
    let form = new formidable.IncomingForm(),files=[],fields=[],docs=[];
    let date = new Date();
    let ms = Date.parse(date)/1000;

    form.uploadDir = 'tmp/';
    form.on('field', (field, value) =>{
        fields.push([field, value]);
    }).on('file', function(field, file) {
        docs.push(file);
        //文件重命名
        fs.renameSync(file.path, "tmp/" + ms + file.name);
    }).on('end', () => {
        //文件上传结束
        res.writeHead(200, {'content-type': 'text/plain'});
        let out = { Resopnse:{ 'result-code':0, timeStamp:new Date(),},
            files:docs
        };
        let sout=JSON.stringify(out);
        res.end(sout);
    });
    form.parse(req, function(err, fields, files) {

        //当文件上传结束后开始读取文件的md5 size 等数据


        err && console.log('formidabel error : ' + err);
        /**
         * 读取到文件
         */
        let file             = files.file;
        let fileLocalUrl     = express.pkgUrl + ms + file.name;
        let downloadUrl      = express.downloadUrl + ms + file.name;
        let fileName         = file.name.split('_');
        let pkgInfo          = {};
        pkgInfo.name         = fileName[0];
        pkgInfo.versionName  = fileName[1];
        pkgInfo.versionCode  = fileName[2].split('.')[0];
        pkgInfo.size         = file.size;
        pkgInfo.url          = downloadUrl;
        pkgInfo.lastModified = getNowFormatDate();

        /**
         * 创建文件流获取md5码
         */

        readFileMd5(fileLocalUrl).then((md5String) => {
            pkgInfo.md5 =  md5String;
            findCurrentVersion().then((version) =>{
                if(version.err){
                    console.log('err: ' + version.err)
                    return;
                }
                if(version.msg && version.msg == 'empty'){
                    versionCollection.create(pkgInfo,(err)=>{
                        if(err){
                            console.log('DB FAILED');
                            return;
                        }
                        console.log('创建数据库成功成功');
                        return;
                    })
                }else{
                    pkgInfo._id = version._id;
                    version     = pkgInfo;
                    versionCollection.update(version,(err)=>{
                        if(err){
                            console.log('DB FAILED');
                            return;
                        }
                        console.log('更新数据库成功成功');
                        return;
                    })

                }
            })
        })
    });

};


/**
 * 提供下载功能
 * @param req
 * @param res
 */
exports.downfile = (req,res)=> {
    if(!req.params.fileName){
        res.status(404);
    }
    let filePath = path.join(express.pkgUrl, req.params.fileName);
    let stats    = fs.statSync(filePath);
    if(stats.isFile()){
         res.set({
             'Content-Type': 'application/octet-stream',
             'Content-Disposition': 'attachment; filename='+req.params.fileName,
         })
         fs.createReadStream(filePath).pipe(res);
     }else{
        res.status(404);
     }
}


/**
 * 获取补丁更新到数据库的修改时间
 * @returns {string}
 */
let getNowFormatDate = () => {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}


/**
 * 前台获取数据并显示到界面上
 * @param req
 * @param res
 */
exports.queryVersion = (req,res)=>{
    findCurrentVersion().then((version)=>{
        if(version.err){
            return res.json({err:version.err});
        }
        return res.json(version);
    })
}

/**
 * 安卓客户端获取最新数据
 * @param req
 * @param res
 */
exports.query = (req,res)=>{
    findCurrentVersion().then((version)=>{
        if(version.err){
            return res.json({err:version.err});
        }
        if(version.msg && version.msg == 'empty'){
            return res.json({
                    fixIndex    : 0,
                    versionCode : 0,
                    downloadUrl : '',
                    md5         : ''
                })
        }
        return res.json({

            fixIndex    : parseInt(version.versionCode),
            versionCode : parseInt(version.versionName),
            downloadUrl : version.url,
            md5         : version.md5
        });
    })
}

/**
 * 重置服务器的版本号
 */
exports.reset = (req,res)=>{
    let versionCollection = global.dbHandle.getModel('version');
    findCurrentVersion().then((version)=>{
        if(version.err || version.msg){
            return res.json({
                err:'当前版本为空或者查询失败'
            })
        }
        versionCollection.findByIdAndRemove(version._id,(err)=>{
            if(err){
               return res.json({
                    err:'删除数据失败'
                }) 
            }else{
                return res.json({
                    msg:'ok'
                })
            }
        })
    })
}