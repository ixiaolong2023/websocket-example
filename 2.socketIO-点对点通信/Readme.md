## 功能介绍：
### 前端
socket.io -> 建立连接
通过?username=xxx登录用户的不同信息  -->  进入不同用户页面  -->  query 方式将用户名传递到服务端
用户 -> 用户 -> 发送消息  -->  用户接收消息

### 后端
socket.io  -->  搭建服务
io.sockets.socket.get(id)  -->  活动登录的用户信息