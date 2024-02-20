const mongoose = require('mongoose');
import Post from "@/models/post";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});
  
 

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = Customer;