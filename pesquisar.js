function pesquisar(req, res, dado){
    console.log('chegou no pesquisar');
    let nome;
    if(dado === null){
        req.db.collection('registro').find({}).toArray((erro, dados) =>{
            console.log("buscou registro");
            
            for(let dado of dados){
                nome = dado.nome;
                console.log("for do pesquisar");
                console.log("nome"+nome);
            }
            
                req.db.collection('dados').find({}).toArray((erro,dados)=>{
                    console.log("chegou nos dados");
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
                    console.log('antes de renderizar '+ nome);
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
                        'home': "",
                        'nome': nome
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