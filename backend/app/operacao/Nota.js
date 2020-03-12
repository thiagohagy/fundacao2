const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
    fornecedor: String,
    nota: String,
    dataCompra: Date,
    ano: String,
    dataVencimento: Date,
    safra: String,
    item: String,
    descricao: String,
    quantidade: Number,
    unidade: String,
    valorUnitario: Number,
});

module.exports = mongoose.model('Nota', Schema);
