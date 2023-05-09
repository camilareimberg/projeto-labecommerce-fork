import { users, products, purchases, createUser, createProduct, getAllProduct, getProductById, getProductByName, createPurchase, getPurchaseByUserId } from "./database";
import { CATEGORY, product, purchase, user } from "./types";
import  express, { Request, Response} from 'express';
import cors from 'cors';
import { unsubscribe } from "diagnostics_channel";
import { db } from "./database/knex";


//método use faz as transformações do arquivo json
const app = express()
app.use(express.json())
app.use(cors())
//listen indica onde o servidor rodará
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Feedback APIs e Express - 14.03 ex. 2 - get all users - método get - rota users e repsosta é o array de usuários
app.get('/users', async (req: Request, res: Response)=> {
 try {
    // const result = await db.raw(`SELECT * FROM users`);
    const result = await db.select("*").from("users");
    res.status(200).send(result);

 }  
 catch(error: any) {
    console.log(error) 
    res.status(400).send(error.message)
}
})

//Feedback APIs e Express - 14.03 ex. 2 - get all products - método get - rota products e repsosta é o array de produtos
app.get('/products', async (req: Request, res: Response)=> {
    try {
        const result= await db.select("*").from("products")
        // const result = await db.raw(`SELECT * FROM products`);
        res.status(200).send(result);
    }  
    catch(error: any) {
       console.log(error) 
       res.status(400).send(error.message)
   }
   })

   //get all purchases
app.get('/purchases', async (req: Request, res: Response)=> {
    try {
        const result = await db.select("*").from("purchases");
        // const result = await db.raw(`SELECT * FROM purchases`);
        res.status(200).send(result);
    }
    catch(error: any) {
        console.log(error) 
        res.status(400).send(error.message)
    }
})


//Feedback APIs e Express - 14.03 ex. 2 - Search Product by name req e res é o handler da função
app.get('/products/search', async (req: Request, res: Response)=> {
    try {
    const q = req.query.q as string
    //faz um filtro de produtos e cada elemento chamou de produto. Se a pessoa de fato mandou uma query, se o q é true então mostra todos os produtos q o nome inclui o q, se não, retorna o produto

    if (!q || q.length<1) {
        res.status(400).send("Opção de pesquisa inválida, tente novamente!")
        return;
    }
    //cód antes do knex
    // const filterProducts: product[] = products.filter((product)=>{
    //     if(q) {
    //                 return product.name.toLowerCase().includes(q.toLowerCase())
    //     }
    //     return product
    // })

const result = await db.raw(`SELECT * FROM products WHERE name= "${q}"`);
    res.status(200).send(result)
} catch (error) {
res.send(error.message)
}
})

//Feedback APIs e Express - 14.03 ex. 3 criar usuário 
app.post('/users', async (req: Request, res: Response)=> {
    try {
    const body = req.body
    const{id, email, name, password} = body

    if (id === undefined) {
        res.status(404);
        throw new Error("Crie um id para o usuário");
     }
     if (email === undefined) {
        res.status(404);
        throw new Error("Crie um email para o usuário");
     }

    const userExists = users.some(user => user.id === id || user.email === email)
    if (userExists) {
        return res.status(400).send('Usuário já cadastrado!')
    }
    if (password === undefined) {
        res.status(404);
        throw new Error("Crie uma senha com no minimo 8 caracteres.");
     }
    if (password.length < 8) {
        res.status(404);
        throw new Error("Senha deve contar no minimo 8 caracteres.");
      }

    //cria o objeto com as infos que estamos recebendo do body -  cód antes do knex
    // const newUser: user = {
    //     id,
    //     email,
    //     password
    // }
    // users.push(newUser)

    await db.raw (`INSERT INTO users (id, email, name, password)
    VALUES ("${id}", "${email}","${name}","${password}")`);

    res.status(201).send("Cadastro realizado com sucesso")   
    }

    catch(error: any) {
	console.log(error) 
	res.status(400).send(error.message)
}
})

//criando novo produto
app.post('/products', async (req: Request, res: Response)=> {
   try {
    const body = req.body
    const{id, name, price, category, image_url} = body
    //cria o objeto com as infos que estamos recebendo do body
    
    if (id === undefined) {
        res.status(404);
        throw new Error("Crie um id para o produto");
     }
     if (name === undefined) {
        res.status(404);
        throw new Error("Crie um nome de identificação para o produto");
     }
     if (price === undefined) {
        res.status(404);
        throw new Error("Informe o preço do produto");
     }
     if (category === undefined) {
        res.status(404);
        throw new Error("Informe uma categoria para o produto: Acessórios, Roupas e calçados ou Eletrônicos")
     }

     const productExists = products.some(product => product.id === id)
     if (productExists) {
         return res.status(400).send('Esse produto já está cadastrado!')
     }
    //cód antes do Knex
    // const newProduct: product = {
    //     id,
    //     name,
    //     price,
    //     category
    // }
    // products.push(newProduct)
    // res.status(201).send("Produto cadastrado com sucesso")
    await db.raw(`INSERT INTO products (id, name, price, category, image_url)
    VALUES ("${id}", "${name}","${price}","${category}", "${image_url}")`);
    res.status(201).send("Produto cadastrado com sucesso") 
   } 

   catch(error: any) {
	console.log(error) 
	res.status(400).send(error.message)
}
})

//criando nova compra
app.post('/purchases', async (req: Request, res: Response)=> {
  
  try {
    const body = req.body
    const{id, total_price, paid, buyer_id} = body
   
    if (!id || !buyer_id || !total_price) {
        throw new Error("Dados invalidos.");
      }
  
      await db.raw(`
        INSERT INTO purchases(id, total_price, paid, buyer_id)
        VALUES("${id}","${total_price}",${paid},${buyer_id})
      `);
      
      res.status(201).send("Compra realizada com sucesso!");
    //  if (id === undefined) {
    //     res.status(404);
    //     throw new Error("IInforme um Id de produto válido");
    //  }
    //  if (quantity === undefined) {
    //     res.status(404);
    //     throw new Error("Informe a quantidade da compra")
    //  }
    //cria o objeto com as infos que estamos recebendo do body - cód antes do Knex
    // const newPurchase: purchase = {
    //     userId,
    //     productId,
    //     quantity,
    //     totalPrice
    // }
    // purchases.push(newPurchase)
    // res.status(201).send("Compra realizada com sucesso")

}
catch(error: any) {
	console.log(error) 
	res.status(400).send(error.message)
}
})


//Aprofundamento Express - 16.03 ex. 01 Get Products by id
app.get('/products/:id', async (req: Request, res: Response)=> {
    
    try{
        const id = req.params.id 
        const result = await db.raw(`SELECT * FROM products WHERE id = "${id}"`);


        if (!result || result.length<1) {
            res.status(400).send("Opção de pesquisa inválida, tente novamente!")
        
        } else {
            res.status(200).send(result)
}
        //cód antes do knex
    //     const filterProductsById = products.find((productsId)=> {
    //     return productsId.id ===id
    // })
    // if (filterProductsById) {
    //     res.status(200).send(filterProductsById)    
    // }

}
    catch(error: any) {
        console.log(error) 
        res.status(400).send(error.message)
    }
})



//Aprofundamento Express - 16.03 ex. 01 Get User Purchases by User id
app.get('/users/:id/purchases', async (req: Request, res: Response)=> {
    
    try{
        const id = req.params.id 
        //cód antes do knex
        //  const filterPurchaseById = purchases.find((purchasesId)=> purchasesId.userId === userId);
       const result= await db.raw(`SELECT * FROM purchases WHERE id = "${id}"`);
       if (result.length > 0){
        res.status(200).send(`Array de compras encontrado: ${result}`)
      } else {
        throw new Error("Purchases not found.")
      }
    }
    catch(error: any) {
        console.log(error) 
        res.status(400).send(error.message)
    }
})


//Aprofundamento Knex - Get  Purchases by id
app.get('/purchases/:id', async (req: Request, res: Response) => {
try {
    const idPurchases = req.params.id as string;
    const [filterPurchases] = await db
    .select("*")
    .from("purchases")
    .where({ id: idPurchases });

    if (!filterPurchases) {
        res.status(404);
        throw new Error("Id não encontrado, tente novamente!");
      }
      const purchaseUsers = await db("purchases")
      .select(
        "purchases.id AS idCompra",
        "purchases.total_price AS valorTotalDaCompra",
        "purchases.paid AS Pagamento",
        "purchases.created_at AS criadoEm",
        "users.id AS idComprador",
        "users.email AS emailComprador",
        "users.name AS nomeComprador"
      )
      .innerJoin("users", "purchases.buyer_id", "=", "users.id")
      .where({ "purchases.id": idPurchases });


      const productByPurchases = await db("purchases_products")
      .select(
        "products.id  AS idProduto",
        "products.name AS nomeProduto",
        "products.price AS preçoProduto",
        "products.category ",
        "products.image_url ",
        "purchases_products.quantity"
      )
      .innerJoin(
        "products",
        "purchases_products.product_id",
        "=",
        "products.id"
      )
      .where({ "purchases_products.purchase_id": idPurchases });

      const result = {
        ...purchaseUsers[0],
        paid: purchaseUsers[0].paid === 0 ? false : true,
        productList: productByPurchases,
      };

      res.status(200).send(result);

}
catch (err) {
    console.log(err);
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (err instanceof Error) {
        res.send(err.message);
      } else {
        res.send("Error inesperado");
      }
    }
})

//Aprofundamento Express - 16.03 ex. 02 Delete User by id
app.delete('/users/:id', (req: Request, res: Response)=> {
    const id= req.params.id

    try{
    //o findIndex passa pelo array procurando. Quando achar, retorna o índice do elemento e nos retorna o índice desse elemento. Se não achar nada retorna -1. O find retorna o elemento, o findIndex retorna o índice do elemento
    const indexToRemove = users.findIndex((account)=> {
        return account.id ===id
    })
    if(indexToRemove>=0){
        //splice tem 2 parâmetros. O primeiro é o indice e o outros quantos itens quer q remova
        users.splice(indexToRemove,1)
        res.status(200).send("Conta deletada com sucesso")   
    }
    throw new Error("Usuário não existe. Digite um id de usuário existente!");
}
catch(error: any) {
    console.log(error) 
    res.status(400).send(error.message)
}
})


//Aprofundamento Express - 16.03 ex. 02 Delete product by id
app.delete('/products/:id', (req: Request, res: Response)=> {
    const id= req.params.id
    try {
       const indexToRemove = products.findIndex((account)=> {
        return account.id ===id
    })
    if(indexToRemove>=0){
        products.splice(indexToRemove,1)
       res.status(200).send("Produto deletado com sucesso")     
    }
    throw new Error("Produto não existe. Digite um id de produto válido!");
    }
   
catch(error: any) {
    console.log(error) 
    res.status(400).send(error.message)
}
  
})

//Aprofundamento Express - 16.03 ex. 03 Edit User by id
app.put('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const newId = req.body.id as string | undefined
        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password as string | undefined

        const newUser = users.find((newUser) => {
            return newUser.id === id
        })
        if (newUser) {
            newUser.id = newId || newUser.id
            newUser.email = newEmail || newUser.email
            newUser.password = newPassword || newUser.password
            res.status(200).send("Usuário editado com sucesso")
        }
        throw new Error("Usuário não existe. Digite um id  válido para editar!");
    }
    catch (error: any) {
        console.log(error)
        res.status(400).send(error.message)
    }
})

//Aprofundamento Express - 16.03 ex. 03 Edit Product by id

app.put('/products/:id', (req: Request, res: Response)=> {
    try {
          const id = req.params.id
     const newId = req.body.id as string| undefined
     const newName= req.body.name as string| undefined
     const newPrice= req.body.price as number| undefined
     const newCategory= req.body.category as CATEGORY| undefined

const productToUpdate = products.find((product)=> {
    return product.id === id
})
if(productToUpdate) {
    productToUpdate.id = newId || productToUpdate.id 
    productToUpdate.name = newName || productToUpdate.name
   productToUpdate.price = isNaN(newPrice) ? productToUpdate.price: newPrice
    productToUpdate.category = newCategory || productToUpdate.category

res.status(200).send("Produto editado com sucesso")  
}  
throw new Error("Produto não existe. Digite um id  válido para editar!");
 }
catch (error: any) {
    console.log(error)
    res.status(400).send(error.message)
}
 

})


// console.table(products)
// console.log(users)
// console.log(purchases)

function repeat():void{
    console.log("=".repeat(70))
}

createUser("5", "amora@gmail.com", "333")
repeat()
createProduct("8", "Vestido", 79, CATEGORY.CLOTHES_AND_SHOES)
repeat()
createPurchase("4", "7", 1, 1500)
//ex. 2 aula typescript II 
console.table(getAllProduct())
console.table(getProductById("7"))
console.table(getProductByName("Co"))
console.table(getPurchaseByUserId("2"))