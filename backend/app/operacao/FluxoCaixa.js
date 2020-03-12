const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
  produtor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Produtor',
  },
  nota: {
    type: mongoose.Schema.ObjectId,
    ref: 'Nota',
  },
  estoque: {
    type: mongoose.Schema.ObjectId,
    ref: 'Estoque',
  },
  valorTotal: Number,
  valorPago: Number,
  vencimento: Date,
  op:[
    {
      tipo: Number, // 1 para pagamento de valor pelo produtor
      valor: Number,
      data: Date,
    }
  ],
  finalizada: Boolean,
});

module.exports = mongoose.model('FluxoCaixa', Schema);
