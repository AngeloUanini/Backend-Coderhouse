import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import ProductManager from "./managers/ProductManager.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager("./src/data/products.json");

io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  socket.emit("productsUpdated", await productManager.getProducts());

  socket.on("addProduct", async (product) => {
    await productManager.addProduct({
      ...product,
      description: "producto realtime",
      code: `RT-${Date.now()}`,
      status: true,
      stock: 10,
      category: "realtime",
      thumbnails: []
    });

    const updatedProducts = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });

  socket.on("deleteProduct", async (pid) => {
  await productManager.deleteProduct(pid);

  const products = await productManager.getProducts();
  io.emit("productsUpdated", products);
});

socket.on("deleteProduct", async (id) => {
  await productManager.deleteProduct(id);
  const products = await productManager.getProducts();
  io.emit("productsUpdated", products);
});
});

httpServer.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});

