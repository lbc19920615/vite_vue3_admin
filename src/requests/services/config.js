export default {
  "swagger": "2.0",
  "info": {
    "description": "用户授权微服务，包括登录、注册、注销等",
    "version": "2.1.1",
    "title": "auth-service",
    "contact": {"name": "yookey"}
  },
  "host": "192.168.1.60:7888",
  "basePath": "/api-auth",
  "tags": [{"name": "auth-api-impl", "description": "Auth Api Impl"}],
  "paths": {
    "/info": {
      "get": {
        "tags": ["auth-api-impl"],
        "summary": "获取登录用户信息",
        "operationId": "infoUsingGET",
        "produces": ["*/*"],
        "responses": {
          "200": {"description": "OK", "schema": {"$ref": "#/definitions/Result"}},
          "401": {"description": "Unauthorized"},
          "403": {"description": "Forbidden"},
          "404": {"description": "Not Found"}
        },
        "deprecated": false
      }
    },
    "/login": {
      "post": {
        "tags": ["auth-api-impl"],
        "summary": "用户登录",
        "operationId": "loginUsingPOST",
        "consumes": ["application/json"],
        "produces": ["*/*"],
        "parameters": [{
          "in": "body",
          "name": "loginRequest",
          "description": "loginRequest",
          "required": true,
          "schema": {"$ref": "#/definitions/LoginRequest"}
        }],
        "responses": {
          "200": {"description": "OK", "schema": {"$ref": "#/definitions/Result"}},
          "201": {"description": "Created"},
          "401": {"description": "Unauthorized"},
          "403": {"description": "Forbidden"},
          "404": {"description": "Not Found"}
        },
        "deprecated": false
      }
    },
    "/logout": {
      "post": {
        "tags": ["auth-api-impl"],
        "summary": "退出登录",
        "operationId": "logoutUsingPOST",
        "consumes": ["application/json"],
        "produces": ["*/*"],
        "parameters": [{
          "in": "body",
          "name": "logoutRequest",
          "description": "logoutRequest",
          "required": true,
          "schema": {"$ref": "#/definitions/LogoutRequest"}
        }],
        "responses": {
          "200": {"description": "OK", "schema": {"$ref": "#/definitions/Result"}},
          "201": {"description": "Created"},
          "401": {"description": "Unauthorized"},
          "403": {"description": "Forbidden"},
          "404": {"description": "Not Found"}
        },
        "deprecated": false
      }
    }
  },
  "definitions": {
    "LoginRequest": {
      "type": "object",
      "properties": {
        "clientId": {"type": "string"},
        "loginName": {"type": "string"},
        "password": {"type": "string"},
        "platform": {"type": "integer", "format": "int32"},
        "project": {"type": "string"},
        "rememberMe": {"type": "integer", "format": "int32"},
        "userLoginType": {"type": "string"},
        "verifyCode": {"type": "string"}
      },
      "title": "LoginRequest"
    },
    "LogoutRequest": {
      "type": "object",
      "properties": {"platform": {"type": "integer", "format": "int32"}, "userId": {"type": "string"}},
      "title": "LogoutRequest"
    },
    "Result": {
      "type": "object",
      "properties": {
        "code": {"type": "integer", "format": "int32"},
        "data": {"type": "object"},
        "msg": {"type": "string"},
        "status": {"type": "integer", "format": "int32"},
        "type": {"type": "string"}
      },
      "title": "Result"
    }
  }
}
