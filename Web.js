const mysql = require('mysql');
const http = require("express");
bodyParser = require('body-parser');
const app = http();
const mysqlconfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: 'pubtest'
};
cookieParser = require('cookie-parser');
app.use(cookieParser(''));
app.use(http.json());
app.post('/newArticle', (request, response) => {
    console.log(request.url);
    const title = request.body.title;
    const body = request.body.body;
    const token = request.cookies.token;
    if (token !== undefined && token.length === 50) {
        const con = mysql.createConnection(mysqlconfig);
        con.connect();
        response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        con.query("SELECT * FROM `admins` WHERE `token` LIKE ?", [token], function (err, result) {
            if(result.length===1){
                con.query("INSERT INTO `articles` (`name`, `text`) VALUES (?, ?)", [title, body]);
                response.end("{\"result\":\"Success\"}");
                con.end();
            }else {
                response.end("{\"result\":\"Invalid token\"}");
                con.end();
            }
        });
    }else response.end("{\"result\":\"Invalid token\"}");
});
app.post('/api/login', (request, response) => {
    let result = {result: "", type: 'error'};
    const login = request.body.login;
    const password = request.body.password;
    let send = true;
    if(login == null||login.length === 0)result.result="Login is empty";
    else if(password == null || password.length === 0)result.result="Password is empty";
    else{
        const con = mysql.createConnection(mysqlconfig);
        con.connect();
        con.query("SELECT `token` FROM `admins` WHERE `login` LIKE ? AND `password` LIKE ?",[login,password], function (err, token) {
            if(token.length===1){
                result.result = "Success";
                result.type='success';
                response.cookie('token', token[0].token, {
                    maxAge: 3600 * 24 * 30,
                })
                send=false;
            }else result.result="Incorrect password or login";
            response.end(JSON.stringify(result));
        });
        con.end();
    }
    if(result.result.length>0&&send)response.end(JSON.stringify(result));
});
//INSERT INTO `admins` (`id`, `login`, `password`, `token`) VALUES (NULL, 'vitia', '1kd9fldi4jcie74lf85jd9vm3j5738dugndpghtmeugpeg8402', 'gd3g13hfi1q38fh1y809gffhyhv1q3wh23gh892q3gh923g23f');
app.get('/post', (req, res) => {
    console.log(req.cookies.token);
    /*const letters = "qwertyuiopasdfghjklzxcvbnm123456790!@#$%^&*()-=_+,.[]";
    //res.cookie('token', );
    let generated = "";
    for (let i = 0; i < 50; i++) {
        const n = Math.floor(Math.random() * letters.length);
        generated += letters.charAt(n);
    }
    res.cookie('token', generated);*/
    res.end();
});
app.get("/login", function(req, res) {
    res.sendFile('static/login.html', {root: __dirname });
});
app.get("/index.js", function(req, res) {
    res.sendFile('static/js/index.js', {root: __dirname });
});
app.get("/css/admin", function(req, res) {
    res.sendFile('static/css/admin.css', {root: __dirname });
});
app.get("/js/admin", function(req, res) {
    res.sendFile('static/js/admin.js', {root: __dirname });
});
app.get("/", function(request, response) {
    const token = request.cookies.token;
    if(token !== undefined && token.length === 50){
        const con = mysql.createConnection(mysqlconfig);
        con.connect();
        con.query("SELECT `id` FROM `admins` WHERE `token` LIKE ?",[token], function (err, id) {
            if(id.length===1)response.sendFile('static/adminpanel.html', {root: __dirname });
            else response.sendFile('static/login.html', {root: __dirname });
        });
        con.end();
    }else response.sendFile('static/login.html', {root: __dirname });
});
app.listen(1234);