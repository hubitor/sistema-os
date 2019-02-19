const express       = require ('express');
const bodyParser    = require ('body-parser');
const db            = require ('express-mongo-db');
const cookieParser  = require ('cookie-parser');
const router        = require ('./rotas');

const app = express();

//middlewares utilizadas no sistema
app.use (db("mongodb://localhost:27017/os"));           //endereço do banco
app.use ('/assets', express.static('assets'));          //utilização de arquivos staticos
app.use (bodyParser.urlencoded({extended: 'true'}));    //tipo de dado que recebemos do html
app.use (cookieParser());                               //cookie, para armazenar dados dos usuarios

app.set('view engine','ejs');

app.use('/', router);

    app.listen(3000, ()=>{
        console.log ("Servidor iniciado em localhost://3000");
    });
    
    
    