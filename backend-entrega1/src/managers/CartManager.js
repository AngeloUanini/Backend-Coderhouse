import fs from "fs/promises";
import path from "path";

class CartManager {
  constructor(filename = "data/carts.json") {
    this.path = path.resolve(filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content || "[]");
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(this.path, "[]");
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  _generateId(carts) {
    const max = carts.reduce(
      (acc, c) => Math.max(acc, Number(c.id) || 0),
      0
    );
    return String(max + 1);
  }

  async getCarts() {
    return await this._readFile();
  }

  async createCart() {
    const carts = await this._readFile();
    const id = this._generateId(carts);
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find((c) => String(c.id) === String(cid));
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const idx = carts.findIndex((c) => String(c.id) === String(cid));
    if (idx === -1) return { ok: false, error: "Cart not found" };

    const prodIdx = carts[idx].products.findIndex(
      (p) => String(p.product) === String(pid)
    );

    if (prodIdx === -1) {
      carts[idx].products.push({ product: String(pid), quantity: 1 });
    } else {
      carts[idx].products[prodIdx].quantity += 1;
    }

    await this._writeFile(carts);
    return { ok: true, cart: carts[idx] };
  }

   async updateCart(cart) {
  const carts = await this.getCarts();
  const index = carts.findIndex(c => c.id === cart.id);

  if (index === -1) return null;

  carts[index] = cart;
  await this._writeFile(carts); 

  return cart;
}

}

export default CartManager;
