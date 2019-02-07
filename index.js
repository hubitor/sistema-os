const express       = require ('express');
const bodyParser    = require ('body-parser');
const db            = require ('express-mongo-db');
const ObjectID      = require ('mongodb').ObjectID;
const pesquisar     = require ('./pesquisar');
// const usuario       = require ('./usuario');

const app = express();

app.use(db("mongodb://localhost:27017/os"));

app.set('view engine','ejs');

app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded());


//Funções GET **************************************************************************************
app.get('/', function(req, res){
    res.render('login');
});

app.get('/home', function(req, res) {
        pesquisar(req, res, null);
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
    app.post('/', function(req, res){
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
        
            let nome        = req.body.nome.toUpperCase();
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
        
        res.send('<strong>Valor invalido</strong><br/><br/> retorne à pagina e revise os valores<br/><br/>'+
        '<a href="/home">click here</a>');
    });
    

    app.listen(3000, ()=>{
        console.log ("Servidor iniciado em localhost://3000");
    });
    
    
    