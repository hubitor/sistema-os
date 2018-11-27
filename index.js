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
    
    function alert(){
        alert("deu ruim");
    }
    
    app.post('/', function(req, res){
        if(req.body.usuario.toUpperCase() === "EDER" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "VINICIUS" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "LUIZ" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "MARLON" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "FELIPE" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "THIAGO" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "THOMAZ" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "GEOVANNE" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "ELOISA" && req.body.senha ==="123" ||
        req.body.usuario.toUpperCase() === "GUSTAVO" && req.body.senha ==="123"
        ){
            
            fs.writeFile('user.csv', req.body.usuario.toUpperCase(), function(erro){
                if(erro){
                    console.log(erro);
                    return;
                }
            });
            
            
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
                res.redirect('home');
            });
        }
    });
    
    app.post('/home', function(req, res){
        let produto = req.body.produto.toUpperCase();
        let os = req.body.os.toUpperCase();
        let conserto = req.body.conserto.toUpperCase();
        let data = req.body.data.split('-');
        let databr = (`${data[2]}-${data[1]}-${data[0]}`);
        console.log(databr);
        
        fs.readFile('user.csv', {encoding:'utf-8'}, function(erro, user){
            if(erro){
                console.log(erro);
                return;
            }
            
            let dados = `${user}; ${produto}; ${os}; ${conserto}; ${databr}\n`;
            
            
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
                    
                    res.redirect('home');
                });
            });
        });
        
        console.log("Arquivo salvo com sucesso");
        
    });
    
    app.listen(3000, ()=>{
        console.log ("Servidor iniciado em localhost://3000");
    });
    