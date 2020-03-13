/* Model*/
const FluxoCaixa = require('./FluxoCaixa');
const Nota = require('./Nota');
const Estoque = require('./Estoque');
const Produtor = require('./../produtor/model');
const Fazenda = require('./../fazenda/model');
const moment = require('moment');


exports.fetchCaixa = async (req, res) => {
  const form = req.body;

  console.log(form)
  const query = FluxoCaixa.find({ produtor: req.decoded._id });
  query.skip(form.skip)
  query.limit(form.limit);
  query.populate('nota estoque');
  query.sort({valorPago: 1});
  const data = await query.exec()
  const total = await FluxoCaixa.count({ produtor: req.decoded._id });

  res.json({data, total});
}

exports.fetchFazenda = async (req, res) => {
  const form = req.body;
  console.log(form)
  const query = Fazenda.find({ produtor: req.decoded._id });
  query.skip(form.skip)
  query.limit(form.limit);
  const data = await query.exec()
  const total = await Fazenda.count({ produtor: req.decoded._id });

  res.json({data, total});

}
exports.fetchEstoque = async (req, res) => {
  const form = req.body;
  const query = Estoque.find({ produtor: req.decoded._id, qtd: {$gt: 0}});
  query.skip(form.skip)
  query.limit(form.limit);
  query.populate('nota');
  const data = await query.exec()
  const total = await Estoque.count({ produtor: req.decoded._id });

  res.json({data, total});
}

exports.fetchSaldo = async (req, res) => {
  const produtor = await Produtor.findOne({ _id: req.decoded._id});
  res.json({saldo: produtor.saldo});
}

exports.getDadosAplicacao = async (req, res) => {
  
  const filtro = {
    produtor: req.decoded._id
  };

  const estoque = await Estoque.find({produtor: req.decoded._id, qtd: {$gt: 0}});
  const fazendas = await Fazenda.find(filtro);

  res.json({ estoque, fazendas})
};

exports.aplicacao = async (req, res) => {

  // lançar produtos
  const form  = req.body;

  const porcAplicacao = form.porcentagemAplicacao / form.talhaoSelecionado.length;
  const fazenda = await Fazenda.findOne({_id: form.fazendaSelecionada._id});

  // pegar produtos do estoque
  for (let i = 0; i < form.produtosSelecionados.length; i++) {
    const produto = form.produtosSelecionados[i];

    // calcular % 
    const totalProdutoAplicar = porcAplicacao * produto.qtd / 100;
    const valorTotalAplicar = produto.vlrUnitario * totalProdutoAplicar;

    // aplicar custo nos talhões selecionados
    for (let iTalhao = 0; iTalhao < form.talhaoSelecionado.length; iTalhao++) {
      const talhao = form.talhaoSelecionado[iTalhao];

      for (let itf = 0; itf < fazenda.talhoes.length; itf++) {
        const talhaoFazenda = fazenda.talhoes[itf];

        if (talhao._id == talhaoFazenda._id) {
          talhaoFazenda.custo = talhaoFazenda.custo > 0 && !isNaN(talhaoFazenda.custo) ? valorTotalAplicar : valorTotalAplicar;
          await fazenda.save();

          // descontar do estoque o produto aplicado
          await Estoque.update({_id: produto._id }, { $inc: { qtd: totalProdutoAplicar * -1 }});
          
        }         
      }
    }
  }

  res.json({success: true});
};



exports.pagamento = async (req, res) => {

  // lançar produtos
  const form  = req.body;
  const errors = [];

  const produtor = await Produtor.findOne({_id: req.decoded._id});
  const operacao = await FluxoCaixa.findOne({_id: form.fluxoId });
  
  const valorRestante = operacao.valorPago > 0 ? operacao.valorTotal - operacao.valorPago : operacao.valorTotal;
  const valorPagoAgora = form.porcentagemPagamento * valorRestante / 100;

  console.log(produtor.saldo)
  console.log(valorPagoAgora)

  if (produtor.saldo >= valorPagoAgora) { // se ele tem saldo suficiente
        
    operacao.valorPago = operacao.valorPago > 0 ?  operacao.valorPago + valorPagoAgora : valorPagoAgora;
    operacao.op.push({
      tipo: 1,
      valor: valorPagoAgora,
      data: moment().toISOString()
    })
   
    produtor.saldo -= valorPagoAgora;

    await operacao.save();
    await produtor.save();
    
    res.json({ success: true});
  } else {
    res.json({ succsess: false, err: 'Saldo insuficiente para pagamento da dívida', form: req.body });
  }
};


exports.compra = async (req, res) => {

  // lançar produtos
  const form  = req.body;
  const errors = [];
  
  for (let i = 0; i < form.notas.length; i++) {
    const nota = form.notas[i];
    
    // salvar dados da nota
    const novaNota = new Nota(nota);
    notaSaved = await novaNota.save();

    if (notaSaved) {
      // salvar dados do estoque
      let errEstoque = false;
      const estoqueSaved = await aplicaEstoque(req.decoded, notaSaved).catch(e => errEstoque = e);

      if (!errEstoque) {

        // dividir pagamentos
        const valorTotal = nota.quantidade * nota.valorUnitario;
        const parcelas = form.tipoVencimeto;  
        const valorParcela = valorTotal/parcelas;
  
        iParcela = 0;
        while( iParcela < parcelas) {
          // salvar dados da operação de caixa conforme vencimento e valor da parcela
          await lancaFluxoCaixa(req.decoded, valorParcela, iParcela, notaSaved, estoqueSaved);          
          iParcela += 1;
        } 

      } else {
        errors.push(errEstoque);    
      }
    } else {
      errors.push(nota);
    }
  }

  if (errors.length == 0) {
    res.json({ success: true});
  } else {
    res.json({ succsess: false, data, err: 'OPS!!! Some error has ocurred', form: req.body });
  }
};

function lancaFluxoCaixa(decoded, valorParcela, iParcela, notaSaved, estoqueSaved) {
  return new Promise(async (resolve, reject)=> {
    const caixaOp = new FluxoCaixa();
    caixaOp.produtor = decoded._id;
    caixaOp.valorTotal = valorParcela;
    caixaOp.valorRestante = valorParcela;
    caixaOp.nota = notaSaved._id;
    caixaOp.estoque = estoqueSaved._id;
    caixaOp.vencimento = moment().add((iParcela+1) * 30, 'days');
    let op = await caixaOp.save();

    resolve(true);
  });
}

function aplicaEstoque(decoded, nota) {
  return new Promise(async (resolve, reject)=> {
    const estoque  = new Estoque();
    estoque.produtor = decoded._id;
    estoque.data = moment().toISOString();
    estoque.qtd =  nota.quantidade,
    estoque.produto = nota.descricao,
    estoque.vlrUnitario = nota.valorUnitario;
    estoque.nota = notaSaved._id;
    let estoqueSaved = await estoque.save();

    if (estoqueSaved) {
      resolve(estoqueSaved);
    } else {
      reject({err: 'Erro ao atualizar estoque'});
    }
  });
}

