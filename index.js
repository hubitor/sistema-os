const express = require ('express');
const fs = require ('fs');
const bodyParser = require ('body-parser');
const db = require ('express-mongo-db');
const isNullOrEmpty = require('is-null-or-empty');
const ObjectID = require('mongodb').ObjectID;

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
        let entrada = [];
        let solucao = [];
        let data = [];
        let id = [];
        
        for (let dado of dados){
            usuario.push(dado.tecnico);
            produto.push(dado.produto);
            os.push(dado.os);
            entrada.push(dado.entrada);
            solucao.push(dado.conserto);
            data.push(dado.data); 
            id.push(dado._id)
        }
        res.render('home', {
            'lista':[
                usuario,
                produto, 
                os,
                entrada,
                solucao,
                data
            ],
            'id': id,
            'home': ""
        });
    })
    
});


app.get('/:data', (req, res) => {
    
    if(!isNaN(Number(req.params.data))){
        req.db.collection('dados').find({os:(Number(req.params.data))}).toArray((erro, dados)=>{
            console.log(req.params.data)
            let usuario = [];
            let produto = [];
            let os = [];
            let solucao = [];
            let data = [];
            let id = [];
            
            for (let dado of dados){
                usuario.push(dado.tecnico);
                produto.push(dado.produto);
                os.push(dado.os);
                solucao.push(dado.conserto);
                data.push(dado.data); 
                id.push(dado._id)
            }
            res.render('home', {
                'lista':[
                    usuario,
                    produto, 
                    os,
                    solucao,
                    data
                ],
                'id': id,
                'home': "/home"
            });
        })
    } else{
        req.db.collection('dados').find({data:(req.params.data)}).toArray((erro, dados)=>{
            console.log(req.params.data)
            let usuario = [];
            let produto = [];
            let os = [];
            let entrada = [];
            let solucao = [];
            let data = [];
            let id = [];
            
            for (let dado of dados){
                usuario.push(dado.tecnico);
                produto.push(dado.produto);
                os.push(dado.os);
                entrada.push(dado.entrada);
                solucao.push(dado.conserto);
                data.push(dado.data); 
                id.push(dado._id)
            }
            res.render('home', {
                'lista':[
                    usuario,
                    produto, 
                    os,
                    entrada,
                    solucao,
                    data
                ],
                'id': id,
                'home': "/home"
            });
        })}
    }
    
    )
    app.get('/delete/:id', (req, res) => {
        req.db.collection('dados').remove({_id: ObjectID(req.params.id)}, (erro) => {
            if(!erro){
                res.redirect('/home');
            }
            
        })
    });
    
    
    app.post('/', function(req, res){
        req.db.collection('usuarios').find({
            nome:   req.body.usuario.toUpperCase(),
            senha:  req.body.senha
        }).toArray((erro, dados) => {
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
        let CorR = null;
        if(req.body.busca !== undefined){
            res.redirect('/'+req.body.busca);
        }

        if(req.body.correio){
            CorR = "correio"
        }
        else if(req.body.recepcao){
            CorR = "recepção"
        }

        if(!isNaN(Number(req.body.os))){
            let produto     = req.body.produto.toUpperCase();
            let os          = Number(req.body.os);
            let entrada     = CorR;
            let conserto    = req.body.conserto.toUpperCase();
            let data        = req.body.data.split('-');
            let databr      = (`${data[2]}-${data[1]}-${data[0]}`);
            let user;
            
            req.db.collection('registro').find({}).toArray((erro, dados)=>{
                for(let dado of dados){
                    user = dado.nome;
                }
                req.db.collection('dados').insert({
                    tecnico: user,
                    produto: produto,
                    os: os,
                    entrada: entrada,
                    conserto: conserto, 
                    data: databr
                });    
            });
            
            res.redirect('home');      
            console.log("Arquivo salvo com sucesso");  
        }
        res.send('<strong>Valor invalido</strong><br/><br/> retorne à pagina e revise os valores<br/><br/>'+
        '<a href="/home">click here</a>');
    });
    
    app.listen(3000, ()=>{
        console.log ("Servidor iniciado em localhost://3000");
    });
    
    
    