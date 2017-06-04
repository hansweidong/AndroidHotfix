import React from 'react';
import style from './style.css'


class Header extends React.Component{
    render(){
        return (
            <div className = "page-header">
                <h1 className = {style.headTitle} >安卓客户端补丁上传 <small> 服务器</small></h1>
            </div>
        )
    }
}

export default Header