import React from 'react';
import FetchData from '../../fetch.js'
import style from '../head/style.css'


let versionModal = {
    name: '',
    versionName:'',
    versionCode:'',
    size:'',
    md5:'',
    time:'',
    url:''
}


class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = versionModal;
    }
    componentWillMount(){
        FetchData.getCurrentVersion().then((version)=>{
            this.setState({
                name        : version.name,
                versionName : version.versionName,
                versionCode : version.versionCode,
                size        : version.size,
                md5         : version.md5,
                time        : version.lastModified,
                url         : version.url,
                
            })
        });
    }
    render(){
        return (
            <div className={`container ${style.tableMsg}`}>
                <div className="panel panel-default">
                    <div className="panel-heading"><span className="glyphicon glyphicon-align-justify"></span> 版本信息说明</div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th className="col-lg-4">参数名</th>
                            <th className="col-lg-8">ֵ值</th>
                        </tr>                
                        </thead>
                        <tbody>
                        <tr>
                            <td>软件</td>
                            <td>{this.state.name}</td>
                        </tr>
                        <tr>
                            <td>软件版本号</td>
                            <td id="versionName">{this.state.versionName}</td>
                        </tr>
                        <tr>
                            <td>补丁号</td>
                            <td id="versionCode">{this.state.versionCode}</td>
                        </tr>
                        <tr>
                            <td>补丁大小</td>
                            <td>{this.state.size}</td>
                        </tr>
                        <tr>
                            <td>补丁MD5校验</td>
                            <td>{this.state.md5}</td>
                        </tr>
                        <tr>
                            <td>最后更新时间</td>
                            <td>{this.state.time}</td>
                        </tr>
                        <tr>
                            <td>下载地址</td>
                            <td>{this.state.url}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Header
