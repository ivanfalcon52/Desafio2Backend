const fs = require('fs');

class ProductManager {
    static #path = "./productos.json";
    constructor() {
        this.products = [];
        ProductManager.#path;
    }

    _getNextId = () => {
        const data = fs.readFileSync(ProductManager.#path);
        const products = JSON.parse(data);

        const count = products.length;
        const nextId = count > 0 ? products[count - 1].id + 1 : 1;

        return nextId;
    };

    _getLocaleTime = () => {
        const time = new Date().toLocaleTimeString();
        return time;
    };

    _createFile = async () => {
        try {
            await fs.promises.access(ProductManager.#path);
        } catch (error) {
            await fs.promises.writeFile(ProductManager.#path, "[]");

            console.log(`File created successfully.`);
        }
    };

    _saveData = async (data) => {
        try {
            await fs.promises.writeFile(
                ProductManager.#path,
                JSON.stringify(data, null, 2)
            );
        } catch (error) {
            console.log(err);
        }
    };

    _readData = async () => {
        try {
            const data = await fs.promises.readFile(ProductManager.#path, "utf-8");
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            console.log(err);
        }
    };

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            const fileExist = fs.existsSync(ProductManager.#path);

            if (!fileExist) {
                await this._createFile();
            }

            const products = await this.getProducts();

            const product = {
                id: this._getNextId(),
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            if (products.find((product) => product.code === code)) {
                console.log(
                    `Product with code ${product.code
                    } already exists - ${this._getLocaleTime()}`
                );
            } else {
                products.push(product);
                await this._saveData(products);

                console.log(
                    `Product was loaded successfully - ${this._getLocaleTime()}`
                );
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    getProducts = async () => {
        try {
            const fileExist = fs.existsSync(ProductManager.#path);

            if (!fileExist) {
                await this._createFile();

                console.log(`[] - ${this._getLocaleTime()}`);
            } else {
                const products = await this._readData();

                return products;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    getProductById = async (id) => {
        try {
            const products = await this.getProducts();
            const product = Object.values(products).find((i) => i.id === id);

            if (product === undefined) {
                console.log(`Not found - ${this._getLocaleTime()}`);
            } else {
                console.log(product);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    updateProduct = async (id, props) => {
        try {
            const products = await this.getProducts();

            const ix = await products.findIndex((product) => product.id === id);

            if (ix === -1) {
                console.log("Product does not exist");
            } else if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
                console.log("Cannot update 'id' or 'code' property");
            } else {
                Object.assign(products[ix], props);
                const updatedProduct = products[ix];
                await this._saveData(products);

                console.log(updatedProduct);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    deleteProduct = async (id) => {
        try {
            let products = await this.getProducts();

            const product = Object.values(products).find((i) => i.id === id);

            if (product !== undefined) {
                products = products.filter((i) => i.id !== id);
                await this._saveData(products);

                console.log(`Product removed - ${this._getLocaleTime()}`);
            } else {
                console.log(`Product does not exist - ${this._getLocaleTime()}`);
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };
}

const productManager = new ProductManager();

const consulta = async () => {
    console.log("----------Consulta de productos----------");
    const queryProducts = await productManager.getProducts();
    console.log(queryProducts);
};
consulta();

const carga = async () => {
    console.log("----------Carga de productos----------");

    try {
        await productManager.addProduct(
            "mate",
            "hermoso mate para tener buenas cebadas",
            20,
            "mate.jpg",
            "mate2024",
            5
        );
        console.log("Producto 1 cargado exitosamente.");

        await productManager.addProduct(
            "termo",
            "mantiene el agua caliente por mucho tiempo",
            15,
            "termo.jpg",
            "termo2024",
            10
        );
        console.log("Producto 2 cargado exitosamente.");
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

carga();


const consultaPorId = async () => {
    console.log("Consulta de producto por id");
    const idProduct = await productManager.getProductById(1);
};
consultaPorId();

const actualizar = async () => {
    console.log("Actualizacion de producto");
    const productUpdate1 = await productManager.updateProduct(1, { title: "mate modificado", description: "mate hermoso modificado", stock: 50 });
};
actualizar();
/*
const borrar = async () => {
    console.log("----------Borra producto por id----------");
    const idDelete = await productManager.deleteProduct(11);
};
borrar();*/