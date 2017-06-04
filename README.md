# AndroidHotfix
一个安卓热更新服务器，基于react es6 初级版 有文件的上传 下载 


克隆仓库
```
git clone https://github.com/Tangpriest/AndroidHotfix.git
```
安装依赖
```
cd AndroidHotfix && npm install
```
修改server.js中的配置,分别是文件存放地址、本机IP地址
```
**
 * 配置本机存放文件地址
 * @type {string}
 */
express.pkgUrl      = 'C:/Users/huang/Tangpriest/workspace/myapp/tmp/';
express.downloadUrl = 'http://127.0.0.1:8100/download/';
```
######启动服务并访问8100端口
