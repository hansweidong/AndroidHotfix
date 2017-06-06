import React from 'react'
import Upload from 'rc-upload';
import FetchData from '../../fetch.js'
import style from '../head/style.css'


/**
 * 定义上传的组件的props
 */
const props = {
    action: '/upload',
    multiple: true,
    onStart(file) {
        console.log('onStart', file, file.name);
    },
    onSuccess(ret) {
        console.log('onSuccess', ret);
        alert('上传成功');
        location.reload();
    },
    onError(err) {
        console.log('onError', err);
        alert('上传失败,错误信息如下:' + err);
    },
    beforeUpload(file, fileList) {
        return new Promise((resolve) => {
            FetchData.getCurrentVersion().then((result)=>{
                let fileNameSplit  = FetchData.fileNameSplit(file.name);
                let nowVersionName = parseInt(result.versionName);
                let nowVersionCode = parseInt(result.versionCode);
                if(fileNameSplit.versionName < nowVersionName){
                    alert('版本名称低于当前版本，请确认后上传');
                    return false;
                }
                if(fileNameSplit.versionName > nowVersionName &&(fileNameSplit.versionCode != 1)){
                    alert('版本号有误，请确认后更新');
                    return false;
                }
                if(fileNameSplit.versionName == nowVersionName && ((fileNameSplit.versionCode - nowVersionCode) != 1)){
                    alert('版本号有误，请确认后更新');
                    return false;
                }
                if(fileNameSplit.suffix != 'apatch'){
                    alert('请确认补丁格式是否正确');
                    return false;
                }else{
                    resolve(true)
                }
            })
        });
    }
};

let getCookie = (name)=>{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
}

class UploadBtn extends React.Component{

    removeCookie(){
        console.log('remove');
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = getCookie('token');
        if (cval != null){
            document.cookie= 'token' + "="+cval+";expires="+exp.toGMTString();
        }
        location.href = '/';
    }
    clearVersion(){
        fetch('/reset').then((rtn)=>{
            if(rtn.err){
                alert(rtn.err);
                location.reload()
            }else{
                alert('重置版本号成功');
                location.reload();
            }
        })
    }
    render(){
        return (
            <div>
                <span className={`btn btn-default fileinput-button ${style.headTitle}`}>
                    <i className="glyphicon glyphicon-upload"></i>
                    <Upload {...props}><span> 开始上传</span></Upload>
                </span>
                <span className={`btn btn-default fileinput-button ${style.logout}`} onClick={this.removeCookie}>
                    <i className="glyphicon glyphicon-off"></i>
                    <span> 用户注销</span>
                </span>
                 <span className={`btn btn-default fileinput-button ${style.logout}`} onClick={this.clearVersion}>
                    <i className="glyphicon glyphicon-repeat"></i>
                    <span> 重置版本</span>
                </span>
            </div>
        )
    }
}

export default UploadBtn