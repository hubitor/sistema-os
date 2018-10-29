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
        let info = [];
        let linhas = dados.split('\n');
        for (let linha of linhas){
            info.push(linha);
        }
       // console.log(info);
        res.render('home', {'lista': info});
    });
    

});


app.post('/', function(req, res){
    let produto = req.body.produto;
    let os = req.body.os;
    let conserto = req.body.conserto;
    let data = req.body.data;
    
    let dados = `${produto}, ${os}, ${conserto}, ${data}\n`;
    
    
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
            let itens = dados.split('\n');
            res.render('home', {'lista': itens});
        });
    });
    console.log("Arquivo salvo com sucesso");
    
});

app.listen(3000, ()=>{
    console.log ("Servidor iniciado em localhost://3000");
});