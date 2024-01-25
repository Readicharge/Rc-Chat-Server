import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },  // name field in the app 
  description: { type: String, required: true },  // longText field in the app 
  price: { type: Number, required: true },  // price field in the app 
  category: { type: String, required: true }, // description field in the app
  brand: { type: String, required: true }, // not added in the app 
  stockQuantity: { type: Number, required: true }, // not added in the app
  images: [{ type: String }], // imageUrl field in the app
  rating: { type: Number, default: 0 }, // rating field in the app
  reviews: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    rating: { type: Number }
  }],  // currently not added in the app for this logic , will add if needed in the future
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // For the internal purpose only 
  createdAt: { type: Date, default: Date.now },  // Timestamps for internal use
  updatedAt: { type: Date, default: Date.now } // Timestamps for internal use
});

const Product = mongoose.model('Product', productSchema);

export default Product;
