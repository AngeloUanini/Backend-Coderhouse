import { Router } from "express";
import ProductModel from "../models/Product.model.js";

const router = Router();

// GET / → listar todos los productos
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      const [key, value] = query.split(":");
      filter[key] = value === "true" ? true : value;
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const result = await ProductModel.paginate(filter, {
      limit: Number(limit),
      page: Number(page),
      sort: sortOption,
      lean: true
    });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// POST / → agregar producto
router.post("/", async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
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
