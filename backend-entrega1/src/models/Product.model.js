import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnails: [String],
  code: {
    type: String,
    unique: true
  },
  stock: Number,
  category: String,
  status: {
    type: Boolean,
    default: true
  }
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
