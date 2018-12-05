const express = require ('express');
const fs = require ('fs');
const bodyParser = require ('body-parser');
const db = require ('express-mongo-db');
const isNullOrEmpty = require('is-null-or-empty');

const app = express();

app.use(db("mongodb://localhost:27017/os"));

app.set('view engine','ejs');

app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
    res.render('login');
});


app.get('/home', function(req, res) {
    
    req.db.collection('dados').find({}).toArray((erro, dados)=>{
        let usuario = [];
        let produto = [];
        let os = [];
        let solucao = [];
        let data = [];
        
        for (let dado of dados){
            usuario.push(dado.tecnico);
            produto.push(dado.produto);
            os.push(dado.os);
            solucao.push(dado.conserto);
            data.push(dado.data); 
        }
        res.render('home', {
            'lista':[
                usuario,
                produto, 
                os,
                solucao,
                data]
            });
        })
    });
    
    
    app.get('/home/:id', function (req, res){
        console.log(req.params);
        res.send("ok");
        fs.readFile('dados.csv', {encoding:'utf-8'}, function(erro, dados){
            if(erro){
                console.log(erro);
                return;
            }
            
            fs.readFile('user.csv', {encoding:'utf-8'}, function(erro, user){
                if(erro){
                    console.log(erro);
                    return;
                }
                
                let usuario = [];
                let produto = [];
                let os = [];
                let solucao = [];
                let data = [];
                
                let linhas = dados.split('\n');
                for (let linha of linhas){
                    let colunas = linha.split(';');
                    usuario.push(colunas[0]);
                    produto.push(colunas[1]);
                    os.push(colunas[2]);
                    solucao.push(colunas[3]);
                    data.push(colunas[4]); 
                }
                res.render('home', {
                    'lista':[
                        usuario,
                        produto, 
                        os,
                        solucao,
                        data]
                    });
                });
            });
            
        });
        
        
        app.post('/', function(req, res){
            req.db.collection('usuarios').find({nome: req.body.usuario.toUpperCase(), senha: req.body.senha}).toArray((erro, dados) => {
                let nome = undefined;
                
                for(let dado of dados){
                    nome = dado.nome;
                }
                
                if(nome !== undefined){
                    req.db.collection('registro').drop();
                    req.db.collection('registro').insert({nome: nome});
                    res.redirect('home');
                }else{
                    res.render('login');
                }
            })
        });
        
        app.post('/home', function(req, res){
            let produto = req.body.produto.toUpperCase();
            let os = req.body.os.toUpperCase();
            let conserto = req.body.conserto.toUpperCase();
            let data = req.body.data.split('-');
            let databr = (`${data[2]}-${data[1]}-${data[0]}`);
            let user;
            
            req.db.collection('registro').find({}).toArray((erro, dados)=>{
                for(let dado of dados){
                    user = dado.nome;
                }
                req.db.collection('dados').insert({
                    tecnico: user,
                    produto: produto,
                    os: os,
                    conserto: conserto, 
                    data: databr
                });    
            });
            
            res.redirect('home');      
            console.log("Arquivo salvo com sucesso");       
        });
        
        app.listen(3000, ()=>{
            console.log ("Servidor iniciado em localhost://3000");
        });
        