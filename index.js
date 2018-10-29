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
        let colunas = [dados.split(',')];
        let linhas = [dados.split('\n')];

        res.render('home', {'lista': linhas});
    });
    

});


app.post('/', function(req, res){
    console.log(req.body);
    let os = req.body.os;
    let conserto = req.body.conserto;
    let data = req.body.data;
    
    let dados = `${os}, ${conserto}, ${data}\n`;
    
    
    fs.writeFile('dados.csv', dados, {flag: 'a'},function(erro){
        if (erro){
            console.log(erro);
            return;
        }

        fs.readFile('dados.csv', {encoding:'utf-8'}, function(erro, dados){
            if(erro){
                console.log(erro);
                return;
            }
            let item = [dados.split(',')];
            res.render('home', {'lista': item});
        });
    });
    console.log("Arquivo salvo com sucesso");
   // res.render('home');
    
});

app.listen(3000, ()=>{
    console.log ("Servidor iniciado em localhost://3000");
});