import { CATEGORY, product, purchase, user } from "./types";

export const users: user[] = [
    {
        id: "2",
        email: "camila@gmail.com",
        password: "123"
    },
    {
        id: "3",
        email: "tiago@gmail.com",
        password: "12345"
    },
    {
        id: "4",
        email: "cassia@gmail.com",
        password: "123456"
    }
]

//void pois não retorna nada. //Adicionando mais um user - typescript II - ex. 2

export function createUser(id: string, email: string, password: string): void {
    const newUser: user = {
        id,
        email,
        password,
    }
    users.push(newUser)
    console.log("Cadastro realizado com sucesso")
}

//buscando o array - typescript II - ex. 2
export function getAllUser(): user[] {
    return users
}


export const products: product[] = [
    {
        id: "5",
        name: "Colar",
        price: 250,
        category: CATEGORY.ACCESSORIES

    },
    {
        id: "6",
        name: "Scarpin Petro",
        price: 180,
        category: CATEGORY.CLOTHES_AND_SHOES

    },
    {
        id: "7",
        name: "Apple Iphone 13",
        price: 1000,
        category: CATEGORY.ELECTRONICS

    }

]


export function createProduct(id: string, name: string, price: number, category: CATEGORY): void {
    const newProduct: product = {
        id,
        name,
        price,
        category
    }
    products.push(newProduct)
    console.log("Produto criado com sucesso")
}

//buscando o array - typescript II - ex. 2
export function getAllProduct(): product[] {
    return products
}

//buscar produto por id - typescript II - ex. 2
export function getProductById(id: string): product[] {
    return products.filter((item) => {
        //compara se o item.id (informado pelo user) é igual a algum id na lista de produtos
        return item.id === id
    })
}


//buscar produto por nome - typescript II - ex. 2
export function getProductByName(name: string): product[] {
    return products.filter((i) => {
        //compara se o i.name (informado pelo user) é igual/inclua a letra digitada
        return i.name.toLowerCase().includes(name.toLowerCase())
    })
}

export const purchases: purchase[] = [
    {
        userId: "2",
        productId: "5",
        quantity: 3,
        totalPrice: 750
    },
    {
        userId: "3",
        productId: "6",
        quantity: 2,
        totalPrice: 360
    },
    {
        userId: "4",
        productId: "7",
        quantity: 3,
        totalPrice: 3000
    }
]
//ex. 3 typescript II - criar nova compra
export function createPurchase(userId: string, productId: string, quantity: number, totalPrice: number): void {
    const newPurchase: purchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }
    purchases.push(newPurchase)
    console.log("Compra realizada com sucesso")
}

//buscando  todas as compras feitas baseado no id do usuário - typescript II - ex. 3
export function getPurchaseByUserId(id: string): purchase[] {
    return purchases.filter((item) => {
        return item.userId === id
    })
}


const resultado = purchases.reduce((acc, current) => acc + (current.quantity * current.totalPrice), 0)

console.log(resultado)
