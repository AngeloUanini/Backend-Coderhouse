import { Router } from "express";
import ProductModel from "../models/Product.model.js";
import CartModel from "../models/Cart.model.js";

const router = Router();

/* =======================
   VISTA /products
======================= */
router.get("/products", async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort,
    query
  } = req.query;

  const filter = {};
  if (query) filter.category = query;

  const options = {
    limit: Number(limit),
    page: Number(page),
    lean: true
  };

  if (sort) {
    options.sort = { price: sort === "asc" ? 1 : -1 };
  }

  const result = await ProductModel.paginate(filter, options);

  res.render("index", {
    products: result.docs,
    totalPages: result.totalPages,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    prevLink: result.hasPrevPage
      ? `/products?page=${result.prevPage}`
      : null,
    nextLink: result.hasNextPage
      ? `/products?page=${result.nextPage}`
      : null,

    cartId: "697a802308970b76af075b6c"
  });
});


/* =======================
   VISTA /products/:pid
======================= */
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel
      .findById(req.params.pid)
      .lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});

/* =======================
   VISTA /carts/:cid
======================= */
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel
      .findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

export default router;
