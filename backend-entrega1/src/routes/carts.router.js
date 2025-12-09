import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

// POST / → crear carrito
router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// GET /:cid → obtener productos del carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// POST /:cid/product/:pid → agregar producto
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  const cart = await cartManager.getCartById(parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const productInCart = cart.products.find(p => p.product == pid);

  if (!productInCart) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  productInCart.quantity = quantity;

  await cartManager.updateCart(cart);

  res.json({ message: "Quantity updated", cart });
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const newProducts = req.body;

  // Validación básica
  if (!Array.isArray(newProducts)) {
    return res.status(400).json({ error: "El body debe ser un array de productos" });
  }

  try {
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Reemplazar productos
    cart.products = newProducts;

    const updatedCart = await cartManager.updateCart(cart);

    res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

export default router;
