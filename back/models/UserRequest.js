const mongoose = require('mongoose');

const userRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending | accepted | rejected
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserRequest', userRequestSchema);
