function pesquisar(req, res, dado, user){
    console.log('chegou no pesquisar');
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

module.exports = pesquisar;