import React from 'react'
import ReactDOM from 'react-dom'
import style from './login.css'
import $ from 'jquery'
import md5 from 'md5'



let getCookie = (name)=>{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
}

class LoginPannel extends React.Component{
    constructor(props){
        super(props)
    }
    clickBtn(){
        let token = getCookie('token') || '';
        let userName = this.refs.myTextInput.value || '';
        let passWord = this.refs.password.value || '';
        if(userName != 'admin' || userName == ''){
            alert('无效的用户');
            location.reload();
        }else{
            $.ajax({
                type:'post',
                url:'/login',
                data:JSON.stringify({
                    userName:userName,
                    password:md5(passWord + token)
                }),
                contentType: "application/json; charset=utf-8",
                success: function(rtnMsg){
                    console.log(passWord);
                    console.log({
                        userName:userName,
                        password:md5(passWord + token)
                    });
                    if(!rtnMsg.code){
                    }else if(rtnMsg.code == 10000){
                        location.href = '/update'
                    }else if(rtnMsg.code == 9999){
                        alert('错误的密码');
                        location.reload();
                    }else{
                        return false;
                    }
                }
            })
        }
    }
    render(){
        return(
            <div className={style.pannel}>
                <h2 className={style.serverName}>安卓补丁下载服务器</h2>
                    <input type="text"     className={style.input} ref="myTextInput" placeholder="Username"></input>
                    <input type="password" className={style.input} ref="password" placeholder="Password"></input>
                    <button className={style.input} onClick={this.clickBtn.bind(this)} value="LOGIN">
                        <p className={style.submitBtn}>LOGIN</p>
                    </button>
            </div>
        )
    }
}

export default LoginPannel

