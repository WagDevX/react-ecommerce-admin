const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema( {
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [{type: [String]}]

});

export const Product = models.Products || model('Products', ProductSchema);