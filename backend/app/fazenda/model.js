const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema({
  produtor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Produtor',
  },
  name: String,
  area: Number, //hectares
  talhoes:[
    {
      nome: String,
      custo: Number,
    }
  ]
});

module.exports = mongoose.model('Fazenda', Schema);
