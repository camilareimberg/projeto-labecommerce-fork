-- Active: 1682333951227@@127.0.0.1@3306
CREATE TABLE users (
id TEXT PRIMARY KEY UNIQUE NOT NULL,
email TEXT UNIQUE NOT NULL,
name TEXT NOT NULL,
password TEXT NOT NULL,
created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime'))
);

DROP TABLE users;

--Get all Users
SELECT * FROM users;


INSERT INTO users (id, email, name, password) VALUES ("123", "camila.reimberg@gmail.com","Camila", "car123"), ("1234", "tiago.marmo@gmail.com","Tiago", "tmm1234"), ("12345", "amora.reimberg@gmail.com", "Amora", "amr12345"), ("123456", "cassia.reimberg@gmail.com","Cassia", "crm123");

--Create User
INSERT INTO users  (id, email, name, password) VALUES ("1234567", "leticia.reimberg@gmail.com", "Leticia", "crm123456");

-- Get All Users - retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * FROM users ORDER BY email ASC;

--Delete User by id
DELETE FROM users WHERE id="123";

--Edit User by id
UPDATE users SET email="amora_reimberg@hotmail.com" WHERE id="12345";

CREATE TABLE products (
id TEXT PRIMARY KEY UNIQUE NOT NULL,
name TEXT NOT NULL,
price REAL NOT NULL,
category TEXT NOT NULL,
image_url TEXT
);
DROP TABLE products;

SELECT * FROM products;

INSERT INTO products (id, name, price, category) VALUES ("1", "Bolsa Preta", 125, "Acessórios"), ("2", "Google Home", 350, "Eletrônicos"), ("3", "Casaco Inverno Vermelho", 238, "Roupas e calçados"), ("4", "Calça Linho", 130, "Roupas e calçados");

--Create Product
INSERT INTO products (id, name, price, category) VALUES ("5", "Batom vermelho", 89, "Acessórios");

--Search Product by name
SELECT * FROM products WHERE name= "Bolsa Preta";

--Get Products by id
SELECT * FROM products WHERE id= "5";

--Delete Product by id
DELETE FROM products WHERE id="1";

--Edit Product by id
UPDATE products SET name="Alexa" WHERE id="2";

--Get All Products versão 1 - retorna o resultado ordenado pela coluna price em ordem crescente e limite o resultado em 20 iniciando pelo primeiro item
SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;

--Get All Products versão 2 - seleção de um intervalo de preços, por exemplo entre 100.00 e 300.00. Retorna os produtos com preços dentro do intervalo definido em ordem crescente
SELECT * FROM products WHERE price>=100 AND price<=300 ORDER BY price ASC;

--Criação da tabela de pedidos
CREATE TABLE purchases (
id TEXT PRIMARY KEY UNIQUE NOT NULL,
total_price REAL NOT NULL,
paid INTEGER NOT NULL DEFAULT(0),
created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
buyer_id TEXT NOT NULL,
FOREIGN KEY (buyer_id) REFERENCES users (id)
);

INSERT INTO purchases (id, total_price, paid, buyer_id) VALUES ("11", 230, 0, "1234" ),  ("22", 400, 1, "1234" ),  ("33", 120, 0, "12345"),  ("44", 450, 1, "12345"),  ("55", 380, 1, "123456"),  ("66", 600, 1, "123456");

SELECT * FROM purchases;

--Edite o status da data de entrega de um pedido - Datetime dá a data atual, porém o horário é 3h a mais do que aquim então se não colocar nada entre parentesis dá esse horário a mais
UPDATE purchases set created_at = DATETIME('2023-04-23 19:56:00') WHERE id="11";

--Crie a query de consulta utilizando junção para simular um endpoint de histórico de compras de um determinado usuário.Mocke um valor para a id do comprador, ela deve ser uma das que foram utilizadas no exercício 2.
SELECT purchases.id,
    purchases.total_price,
    purchases.paid,
    purchases.created_at,
    purchases.buyer_id,
    users.email
    FROM purchases
    INNER JOIN users ON users.id = purchases.buyer_id;

CREATE TABLE purchases_products (
purchase_id TEXT NOT NULL,
product_id TEXT NOT NULL,
quantity INTEGER NOT NULL,
FOREIGN KEY (product_id) REFERENCES products (id),
FOREIGN KEY (purchase_id) REFERENCES purchases (id)
    );

INSERT INTO purchases_products VALUES ("11","1",7 ), ("22","2",3 ), ("33","3",1 ), ("44","4",2 ), ("11","5",2);

SELECT * FROM purchases_products;

SELECT users.email AS emailUsuario,
users.name AS nomeusuario,
products.name AS produto,
products.price AS precoProduto,
products.category AS categoriaProduto,
purchases.paid AS pagamentoRealizado,
purchases_products.quantity AS Quantidade,
purchases.total_price AS precoTotalDaCompra,
purchases_products.purchase_id AS numeroDaCompra
FROM purchases_products 
LEFT JOIN products ON purchases_products.product_id = products.id
LEFT JOIN purchases ON purchases_products.purchase_id = purchases.id
LEFT JOIN users ON purchases.buyer_id = users.id;