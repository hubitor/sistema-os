const express = require ('express');
const fs = require ('fs');
const bodyParser = require ('body-parser');

const app = express();

app.set('view engine','ejs');

app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded());


app.get('/', function(req, res) {
fs.readFile('dados.csv', {encoding:'utf-8'}, function(erro, dados){
    if(erro){
        console.log(erro);
        return;
    }


     res.render("home", {'lista':dados});
});
    
    
});


app.post('/', function(req, res){
    console.log(req.body);
    let os = req.body.os;
    let conserto = req.body.conserto;
    let data = req.body.data;
    
    let dados = [os, conserto, data];
    
    
    fs.writeFile('dados.csv', dados, function(erro){
        if (erro){
            console.log(erro);
            return;
        }
    });
    console.log("Arquivo salvo com sucesso");
    res.render('home');
    
});

app.listen(3000, ()=>{
    console.log ("Servidor iniciado em localhost://3000");
});