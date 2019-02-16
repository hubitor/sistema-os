// Rotas do sistema

// importação dos modulos
const express       = require('express');
const pesquisar     = require ('./pesquisar');
const ObjectID      = require ('mongodb').ObjectID;

const router        = express.Router();

//Funções GET **************************************************************************************
router.get('/', function(req, res){
    res.redirect('login');
});

router.get('/adm', function(req, res){
    res.render('adm');
});

router.post('/adm', function(req, res){
    let caixa       = req.body.caixa;
    let produto     = req.body.produto;
    let descricao   = req.body.descricao;
    let preco       = req.body.preco;

    req.db.collection('estoque').insert({
        caixa:      caixa,
        produto:    produto,
        descricao:  descricao,
        preco:      preco
    })
    
    res.render('adm');
});

router.get('/login', function(req, res){
    res.render('login');
});

router.get('/home', function(req, res) {
    let nome = req.cookies
        pesquisar(req, res, null, nome);
    });

router.get('/estoque', function(req, res){
        
            req.db.collection('estoque').find({}).toArray((erro,dados)=>{
                let caixa = [];
                let produto = [];
                let descricao = [];
                let preco = [];

                
                for (let dado of dados){
                    caixa.push(dado.caixa);
                    produto.push(dado.produto);
                    descricao.push(dado.descricao);
                    preco.push(dado.preco)

                }
                res.render('estoque', {
                    'lista':[
                        caixa,
                        produto, 
                        descricao,
                        preco,

                    ],
                    'home': ""
                });
            })
        });
// })

router.get('/:data', (req, res) => {
    
    if(!isNaN(Number(req.params.data))){
        pesquisar(req, res, Number(req.params.data));
        
        
    } else{
        pesquisar(req, res, req.params.data);
    }
});
    
    router.get('/delete/:id', (req, res) => {
        req.db.collection('dados').remove({_id: ObjectID(req.params.id)}, (erro) => {
            if(!erro){
                res.redirect('/home');
            }
        })
    });
    
    //Funções POST *********************************************************************************************
    router.post('/login', function(req, res){
        let travar;

        res.cookie('nome', req.body.usuario.toUpperCase());

        //condição para trava o sistema
        if(req.body.usuario.toLowerCase() === "travar"){
            req.db.collection('travar').drop();
            req.db.collection('travar').insert({travar: 1});
        }
        
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
                
                if(nome !== undefined && travar == 0)
                    res.redirect('home');
                else
                    res.render('login');
            })
        });
    });
    
    router.post('/home', function(req, res){

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
    
    module.exports = router;