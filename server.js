const mysql = require('mysql');
const http = require("express");
bodyParser = require('body-parser');
const app = http();
const format = require('date-format');
cookieParser = require('cookie-parser');
const mysqlconfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: 'pubtest'
};
app.get('/listarts', (request, response) => {
    console.log(request.url);
    const con = mysql.createConnection(mysqlconfig);
    con.connect();
    response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
    con.query("SELECT * FROM `articles`", function (err, result) {
        for (let i = 0; i < result.length; i++) {
            let res = result[i].text.split(' ', 16);
            if (res.length > 15) {
                res.length = 15;
                result[i].text = res.join(' ') + "...";
            }
        }
        response.end(JSON.stringify(result));
    });
    con.end()
})
app.get('/article', (request, response) => {
    console.log(request.url);
    const con = mysql.createConnection(mysqlconfig);
    con.connect();
    const article = request.query.id;
    if (article == null || article.length === 0 || article <= 0) {
        response.end("[]");
    } else {
        response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        con.query("SELECT `name`, `text` FROM `articles` WHERE `id` = ?", [article], function (err, result) {
            response.end(JSON.stringify(result));
        });
    }
    con.end()
});
app.get('/comments', (request, response) => {
    console.log(request.url);
    const con = mysql.createConnection(mysqlconfig);
    con.connect();
    const article = request.query.id;
    if (article == null || article.length === 0 || article <= 0) {
        response.end("[]");
    } else {
        response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        con.query("SELECT `comment`, `name`, `time` FROM `coments` WHERE `article` = ?", [article], function (err, result) {
            response.end(JSON.stringify(result));
        });
    }
    con.end()
});
app.use(http.json());
app.post('/comment', (request, response) => {
    console.log(request.url);
    console.log(request.body);
    const article = request.body.id;
    const fio = request.body.fio;
    const email = request.body.email;
    const comment = request.body.comment;
    if (article == null || article.length === 0 || article <= 0 || fio == null || fio.length === 0 ||
        email == null || email.length === 0 || comment == null || comment.length === 0) {
        response.end("[]");
    } else {
        const con = mysql.createConnection(mysqlconfig);
        con.connect();
        const time = format('dd.MM hh:mm', new Date());
        response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        con.query("INSERT INTO `coments` (`article`, `comment`, `name`, `email`, `time`) VALUES (?, ?, ?, ?, ?);",
            [article, comment, fio, email, time]);
        con.end()
    }
    response.end();
});
app.use(cookieParser('token'));
app.get('newArticle', (request, response) => {
    console.log(request.url);
    const title = request.body.title;
    const body = request.body.body;
    const token = request.cookies.token;
    if (token == null || token.length !== 50) {
        const con = mysql.createConnection(mysqlconfig);
        con.connect();
        response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        con.query("SELECT * FROM `admins` WHERE `token` LIKE ?", [token], function (err, result) {

        });
        con.end()
    }
});
app.post('login', (request, response) => {
    const login = request.body.login;
    const password = request.body.password;
    if (login == null || login.length === 0 || login.length < 5 || login.length > 50 ||
        password == null || password.length === 0 || password.length < 5 || password.length > 50) {
        response.end("[]");
    }else{

    }
    response.end();
});
//INSERT INTO `admins` (`id`, `login`, `password`, `token`) VALUES (NULL, 'vitia', '1kd9fldi4jcie74lf85jd9vm3j5738dugndpghtmeugpeg8402', 'gd3g13hfi1q38fh1y809gffhyhv1q3wh23gh892q3gh923g23f');
/*app.get('/post', (req, res) => {
    //console.log(req.cookies.token);
    const letters = "qwertyuiopasdfghjklzxcvbnm123456790!@#$%^&*()-=_+,.[]";
    //res.cookie('token', );
    let generated = "";
    for (let i = 0; i < 50; i++) {
        const n = Math.floor(Math.random() * letters.length);
        generated += letters.charAt(n);
    }
    res.cookie('token', generated);
    res.end();
});*/
app.listen(3000);