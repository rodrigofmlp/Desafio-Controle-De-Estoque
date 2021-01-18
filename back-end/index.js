const express = require('express');
const database = require('./database');
const server = express();

server.use(express.json());

server.use((req, res, next) =>{
    res.header('Acess-Control-Allow-Origin', "*");
    res.header('Acess-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Acess-Control-Allow-Headers', 'Content-Type');
    next();
});

server.get('/',(req,res)=>{
    return res.json({result: 'API-with-data-base'});
});

let nextId = null;

async function getNextId(req, res, next){
    await database.query(`SELECT MAX(id) FROM products`,
    {type: database.QueryTypes.SELECT})
    .then(id =>{
        nextId = id[0].max;
        nextId++;
    });
    next();
};

server.get('/products', async (req,res)=>{

    let products;

   await database.query(`SELECT * FROM products`, {type: database.QueryTypes.SELECT})
        .then(results =>{
            products = results;
        }) .catch(error =>{
            return res.json('erro ao buscar produtos')
        })

        return res.json(products);
});

server.post('/products', getNextId, async (req,res)=>{

    let inseriu;

    const{name, marca, quantidade, perecível} = req.body;

    await database.query(`INSERT INTO products_data VALUES(${nextId}, '${name}','${marca}',${quantidade},${perecível})`, {type: database.QueryTypes.INSERT})
    .then(result =>{
        inseriu = result
    }) .catch(error =>{
        res.json('erro ao inserir dado');
    })
    return res.json(inseriu);
});

server.delete('/products/:id', async(req,res)=>{

    const { id } = req.params;

    await database.query(`DELETE FROM products WHERE id = ${id};`,
     {type:database.QueryTypes.DELETE})
    .catch(error=>{
        res.json('erro ao deletar dado');
    });
    return res.json({result: `Produto deletado com sucesso`});
});

server.put('/products', async(req,res)=>{
    
    let atualizou;

    const{id, name, marca, quantidade, perecível} = req.body;

    await database.query(`UPDATE products SET(name='${name}',brand='${marca}',quantidade=${quantidade},perecível=${perecível}) WHERE(id=${id})`, {type:database.QueryTypes.UPDATE})
    .then(result=>{
        atualizou=result
    }) .catch(error=>{
        res.json('erro ao atualizar dado');
    })
    return res.json(atualizou);
});

server.listen(process.env.PORT);