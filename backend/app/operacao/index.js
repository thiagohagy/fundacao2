const express = require('express');
const rotas = express.Router();

const controller = require('./controller');

rotas.post('/', controller.index);
rotas.post('/compra', controller.compra);
rotas.post('/aplicacao', controller.aplicacao);
rotas.post('/pagamento', controller.pagamento);
rotas.get('/getDadosAplicacao', controller.getDadosAplicacao);

module.exports = rotas;
