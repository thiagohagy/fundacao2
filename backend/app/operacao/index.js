const express = require('express');
const rotas = express.Router();

const controller = require('./controller');

rotas.post('/fetchCaixa', controller.fetchCaixa);
rotas.post('/fetchFazenda', controller.fetchFazenda);
rotas.post('/fetchEstoque', controller.fetchEstoque);
rotas.post('/fetchSaldo', controller.fetchSaldo);
rotas.post('/compra', controller.compra);
rotas.post('/aplicacao', controller.aplicacao);
rotas.post('/pagamento', controller.pagamento);
rotas.get('/getDadosAplicacao', controller.getDadosAplicacao);

module.exports = rotas;
