function pesquisar(req, res, dado){
    if(dado === null){
        req.db.collection('dados').find({}).toArray((erro,dados)=>{
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
                'home': ""
            });
        })
    }else{
        req.db.collection('dados').find( { $or: [ { os: dado}, { data: dado } ] } ).toArray((erro, dados)=>{
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
    }
}

module.exports = pesquisar;