import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

import ProductManager from "./managers/ProductManager.js";

const productManager = new ProductManager("./src/data/products.json");

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});


app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});


export default app;
