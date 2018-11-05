const express = require ('express');
const fs = require ('fs');
const bodyParser = require ('body-parser');

const app = express();



app.set('view engine','ejs');

app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
    res.render('login');
});


app.get('/home', function(req, res) {
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

function alert(){
    alert("deu ruim");
}

app.post('/', function(req, res){
    if(req.body.usuario.toUpperCase() === "EDER" && req.body.senha ==="123"){
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
            res.redirect('home');
        });
    }
});

app.post('/home', function(req, res){
    let produto = req.body.produto.toUpperCase();
    let os = req.body.os.toUpperCase();
    let conserto = req.body.conserto.toUpperCase();
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