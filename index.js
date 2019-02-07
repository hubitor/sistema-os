const express       = require ('express');
const bodyParser    = require ('body-parser');
const db            = require ('express-mongo-db');
const ObjectID      = require ('mongodb').ObjectID;
const pesquisar     = require ('./pesquisar');
const cookieParser  = require ('cookie-parser');

const app = express();

//middlewares utilizadas no sistema
app.use (db("mongodb://localhost:27017/os"));   //endereço do banco
app.use ('/assets', express.static('assets'));  //utilização de arquivos staticos
app.use (bodyParser.urlencoded());              //padrão de comunicação ??
app.use (cookieParser());                       //cookie, para armazenar dados dos usuarios

app.set('view engine','ejs');

//Funções GET **************************************************************************************
app.get('/', function(req, res){
    res.redirect('login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/home', function(req, res) {
    let nome = req.cookies
        pesquisar(req, res, null, nome);
    });

app.get('/:data', (req, res) => {
    
    if(!isNaN(Number(req.params.data))){
        pesquisar(req, res, Number(req.params.data));
        
        
    } else{
        pesquisar(req, res, req.params.data);
    }
});
    
    app.get('/delete/:id', (req, res) => {
        req.db.collection('dados').remove({_id: ObjectID(req.params.id)}, (erro) => {
            if(!erro){
                res.redirect('/home');
            }
        })
    });
    
    //Funções POST *********************************************************************************************
    app.post('/login', function(req, res){
        res.cookie('nome', req.body.usuario.toUpperCase());
        if(req.body.usuario.toLowerCase() === "travar"){
            req.db.collection('travar').drop();
            req.db.collection('travar').insert({travar: 0});
        }
        let travar;
        req.db.collection('travar').find({}).toArray((erro, dados) =>{
            for(let dado of dados){
                travar = dado.travar;
            }

            req.db.collection('usuarios').find({
                nome:   req.body.usuario.toUpperCase(),
                senha:  req.body.senha
            }).toArray((erro, dados) => {
                let nome = undefined;
                
                for(let dado of dados){
                    nome = dado.nome;
                }
                
                if(nome !== undefined && travar == 0){
                    req.db.collection('registro').drop();
                    req.db.collection('registro').insert({nome: nome});
                    console.log(req.cookies);
                    res.redirect('home');
                }else{
                    res.render('login');
                }
            })
        });
    });
    
    app.post('/home', function(req, res){
        let CorR = "null";
        if(req.body.busca !== undefined){
            res.redirect('/'+req.body.busca);
        }
        
        if(req.body.correio){
            CorR = "correio"
        }
        else if(req.body.recepcao){
            CorR = "recepção"
        }
        
            let nome        = req.cookies.nome;
            let produto     = req.body.produto.toUpperCase();
            let os          = Number(req.body.os);
            let entrada     = CorR;
            let conserto    = req.body.conserto.toUpperCase();
            let data        = req.body.data.split('-');
            let databr      = (`${data[2]}-${data[1]}-${data[0]}`);

                req.db.collection('dados').insert({
                    tecnico: nome,
                    produto: produto,
                    os: os,
                    entrada: entrada,
                    conserto: conserto, 
                    data: databr
                });    
            
            res.redirect('home');      
            console.log("Arquivo salvo com sucesso");  
    });
    

    app.listen(3000, ()=>{
        console.log ("Servidor iniciado em localhost://3000");
    });
    
    
    