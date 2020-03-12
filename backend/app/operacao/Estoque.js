const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
  data: Date,
  produtor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Produtor',
  },
  qtd: Number,
  produto: String,
  vlrUnitario: Number,
  nota:  {
    type: mongoose.Schema.ObjectId,
    ref: 'Nota',
  }
});

module.exports = mongoose.model('Estoque', Schema);
