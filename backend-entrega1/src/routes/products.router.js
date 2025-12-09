import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// GET / → listar todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET /:pid → obtener producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// POST / → agregar producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /:pid → actualizar producto
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const updated = await productManager.updateProduct(pid, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /:pid → eliminar producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await productManager.deleteProduct(pid);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
