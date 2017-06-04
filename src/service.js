/**
 * Created by Huangliang on 2017/5/24.
 */
let express  = require('express');
let mongoose = require('mongoose');
let md5      = require('md5');

let queryAdmin = () => {
    let User  = global.dbHandle.getModel('user');
    let query = {
        userName:'admin'
    }
    let admin = {
        userName:'admin',
        password:'admin'
    }
    User.find(query,(err,result) => {
        if(err){
            console.log('查询用户失败')
            return;
        }
        if(result && result.length == 0){
            User.create(admin,(err) => {
                if(err){
                    console.log('用户不存在，初始化失败');
                    return;
                }
                console.log('用户不存在，初始化用户成功');
            })
        }else{
            console.log('用户存在')
        }
    })
};


setInterval(queryAdmin,1000 * 60);

module.exports = {
    message:'start Serive'
};