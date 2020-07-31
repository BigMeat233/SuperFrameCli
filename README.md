# DZCli For Node-Corejs

## 1. 安装依赖

```shell
npm install
```

## 2. 开发环境

```shell
# 启动自动编译
npm start

# 另起一个终端根据实际需求执行以下指令(二选一)
# 自动重启服务
npm run dev:auto

# 单次启动服务
npm run dev
```

## 2. 编译打包

```shell
npm run build
```

## 3. 清理工作区

```shell
npm run clear
```

## 4. Demo功能

- ### 4.1 上传文件
  
  #### 请求地址

  ```/CliTest/Upload.do```

  #### 请求方式

  ```POST - multipart/form-data```

  #### 请求参数

  - ```file```：```Blob```类型，文件包含的内容
  - ```fileName```：```String```类型，文件存储的名称

- ### 4.2 文件列表

  #### 请求地址

  ```/CliTest/ReadFiles.do```

  #### 请求方式

  ```POST - all```

  #### 请求参数

  无

- ### 4.3 删除文件

  #### 请求地址

  ```/CliTest/Remove.do```

  #### 请求方式

  ```POST - application/json```
  ```POST - application/x-www-form-urlencoded```

  #### 请求参数

  - ```fileName```：```String```类型，文件存储的名称

- ### 4.4 文件预览

  #### 请求地址

  ```/CliTest/Display/[fileName]```

  #### 请求方式

  ```GET - all```

  #### 请求参数

  无
