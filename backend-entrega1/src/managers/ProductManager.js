import fs from "fs/promises";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    // Generamos ID autoincremental
    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      status: true,
      thumbnails: [],
      ...product
    };

    products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    // No permitir actualizar el id
    delete updatedFields.id;

    products[index] = {
      ...products[index],
      ...updatedFields
    };

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter(p => p.id != id);

    if (products.length === newProducts.length) {
      throw new Error("Producto no encontrado");
    }

    await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
  }

  async deleteProduct(id) {
  const products = await this.getProducts();

  const filteredProducts = products.filter(p => String(p.id) !== String(id));

  await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));

  return filteredProducts;
}
}
