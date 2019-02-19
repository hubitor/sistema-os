function pesquisar(req, res, dado, user){

    let nome = user;
    if(dado === null){
        req.db.collection('registro').find({}).toArray((erro, dados) =>{
            
            for(let dado of dados){
                nome = dado.nome;
            }
            
                req.db.collection('dados').find({}).toArray((erro,dados)=>{
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
                        entrada.push(dado.entrada)
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

    }else{
        req.db.collection('dados').find( { $or: [ { os: dado}, { data: dado } ] } ).toArray((erro, dados)=>{
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
        })
    }
}

function exibirEstoque(req, res){
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
}


// module.exports = exibirEstoque;
module.exports = pesquisar;

// exports.pesquisar = pesquisar();
// exports.pesquisa = exibirEstoque;

