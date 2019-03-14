// Rotas do sistema

// importação dos modulos
const express       = require('express');
const pesquisar     = require ('./pesquisar');
// const exibirEstoque     = require ('./exibirEstoque');
const ObjectID      = require ('mongodb').ObjectID;

const connStr = "Server=xxx;Database=xxx;User Id=xxx;Password=xxx;";
const sql = require("mssql");


sql.connect(connStr)
.then(conn => global.conn = conn)
.catch(err => console.log(err));

function execSQLQuery(sqlQry, res){
    global.conn.request()
               .query(sqlQry)
               .then(result => console.log("funcionou"))
               .catch(err => res.json(err));
}

const router        = express.Router();

//Funções GET **************************************************************************************
router.get('/', function(req, res){
    res.redirect('login');
});

router.get('/adm', function(req, res){
    res.render('adm');
});

router.get('/login', function(req, res){
    res.render('login');
});

router.get('/sair', function(req, res){
    res.clearCookie('nome');
    res.redirect('login');
})

router.get('/home', function(req, res) {
    let nome = "ssdsad";
    nome = req.cookies;
    //caso não esteja logado, ir para a tela de login
    if(nome.nome === undefined){
        res.redirect('login');
        return;
    }

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
    
    res.cookie('nome', req.body.usuario.toUpperCase(), { expires: new Date(Date.now() + 1800000), httpOnly: true });
    
    //condição para trava o sistema
    if(req.body.usuario.toLowerCase() === "travar"){
        req.db.collection('travar').drop();
        req.db.collection('travar').insert({travar: 1});
    }
    
    //Verifica se o sistemas esta travado
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
    
    let CorreioRecepcao = "null";
    
    if(req.body.correio){
        CorreioRecepcao = "correio"
    }
    else if(req.body.recepcao){
        CorreioRecepcao = "recepção"
    }
    
    let nome        = req.cookies.nome;
    let produto     = req.body.produto.toUpperCase();
    let os          = Number(req.body.os);
    let entrada     = CorreioRecepcao;
    let conserto    = req.body.conserto.toUpperCase();
    let data        = req.body.data.split('-');
    let dataDelta   = (`${data[0]}-${data[1]}-${data[2]}`);
    let databr      = (`${data[2]}/${data[1]}/${data[0]}`);

    if(nome === undefined || nome === "" || nome === null){
        res.redirect('/');
        return;
    }

    if(os === 0 || entrada === null || conserto === "" || data[2] === undefined){
        res.send('Erro: preencha todos os dados');
        return;
    }
    
    req.db.collection('dados').insert({
        tecnico:  nome,
        produto:  produto,
        os:       os,
        entrada:  entrada,
        conserto: conserto, 
        data:     databr
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

    // execSQLQuery(`UPDATE Clientes SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`, res);
    
    execSQLQuery(`UPDATE ITEMAT SET desc_problema2='LAB: ${conserto}', posicao = 'CONSERTADO', tecnico = '${nome}', dt_conserto = '${dataDelta}' WHERE cod_assistencia= ${os}`, res);
    console.log(dataDelta);
    res.redirect('home');      
});

module.exports = router;
