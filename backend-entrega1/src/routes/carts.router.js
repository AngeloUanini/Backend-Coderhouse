import { Router } from "express";
import CartModel from "../models/Cart.model.js";


const router = Router();

// POST / → crear carrito
router.post("/", async (req, res) => {
  const cart = await CartModel.create({ products: [] });
  res.status(201).json(cart);
});


// GET /:cid → obtener productos del carrito
router.get("/:cid", async (req, res) => {
  const cart = await CartModel
    .findById(req.params.cid)
    .populate("products.product");

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  res.json(cart);
});


// POST /:cid/product/:pid → agregar producto
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const productIndex = cart.products.findIndex(
    p => p.product.toString() === pid
  );

  if (productIndex === -1) {
    cart.products.push({ product: pid, quantity: 1 });
  } else {
    cart.products[productIndex].quantity++;
  }

  await cart.save();
  res.json(cart);
});


router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  const cart = await CartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const productInCart = cart.products.find(
    p => p.product.toString() === pid
  );

  if (!productInCart) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  productInCart.quantity = quantity;
  await cart.save();

  res.json(cart);
});


router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const newProducts = req.body;

  if (!Array.isArray(newProducts)) {
    return res.status(400).json({ error: "El body debe ser un array de productos" });
  }

  const cart = await CartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  cart.products = newProducts;
  await cart.save();

  res.json(cart);
});


router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const productIndex = cart.products.findIndex(
    p => p.product.toString() === pid
  );

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  cart.products.splice(productIndex, 1);
  await cart.save();

  res.json(cart);
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel.findById(cid);
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  cart.products = [];
  await cart.save();

  res.json({ message: "Cart emptied successfully", cart });
});

export default router;
