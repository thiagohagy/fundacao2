/* Model*/
const FluxoCaixa = require('./FluxoCaixa');
const Nota = require('./Nota');
const Estoque = require('./Estoque');
const Produtor = require('./../produtor/model');
const Fazenda = require('./../fazenda/model');
const moment = require('moment');


exports.index = async (req, res) => {

  const fluxos = await FluxoCaixa.find({ produtor: req.decoded._id }).populate('nota estoque').sort({valorPago: 1});
  const estoques = await Estoque.find({ produtor: req.decoded._id, qtd: {$gt: 0}});
  const fazendas = await Fazenda.find({ produtor: req.decoded._id });
  const produtor = await Produtor.findOne({ _id: req.decoded._id});

  res.json({ fluxos, estoques, fazendas , saldo: produtor.saldo });
};


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

  // pegar produtos do estoque
  for (let i = 0; i < form.produtosSelecionados.length; i++) {
    const produto = form.produtosSelecionados[i];

    // calcular % 
    const totalProdutoAplicar = porcAplicacao * produto.qtd / 100;
    const valorTotalAplicar = produto.vlrUnitario * totalProdutoAplicar;

    console.log(`${produto.nome} - ${totalProdutoAplicar} * ${produto.vlrUnitario}  = ${valorTotalAplicar} `)

    // aplicar custo nos talhões selecionados

    for (let iTalhao = 0; iTalhao < form.talhaoSelecionado.length; iTalhao++) {
      const talhao = form.talhaoSelecionado[iTalhao];

      const fazenda = await Fazenda.findOne({'talhoes._id': talhao._id});

      for (let itf = 0; itf < fazenda.talhoes.length; itf++) {
        const talhaoFazenda = fazenda.talhoes[itf];

        if (talhao._id == talhaoFazenda._id) {
          talhaoFazenda.custo = talhaoFazenda.custo > 0 && !isNaN(talhaoFazenda.custo) ? valorTotalAplicar : valorTotalAplicar;

          await fazenda.save();
          await Estoque.update({_id: produto._id }, { $inc: { qtd: totalProdutoAplicar * -1 }});
          
          // descontar do estoque o produto aplicado
          console.log('aplicou valor no talhao')
        }         
      }
    }
  }

  res.json({success: true});
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
      const estoque  = new Estoque();
      estoque.produtor = req.decoded._id;
      estoque.data = moment().toISOString();
      estoque.qtd =  nota.quantidade,
      estoque.produto = nota.descricao,
      estoque.vlrUnitario = nota.valorUnitario;
      estoque.nota = notaSaved._id;
      let estoqueSaved = await estoque.save();

      // dividir pagamentos
      const valorTotal = nota.quantidade * nota.valorUnitario;
      const parcelas = form.tipoVencimeto;

      const valorParcela = valorTotal/parcelas;

      iParcela = 0;
      while( iParcela < parcelas) {
        // salvar dados da operação de caixa conforme vencimento e valor da parcela
        const caixaOp = new FluxoCaixa();
        caixaOp.produtor = req.decoded._id;
        caixaOp.valorTotal = valorParcela;
        caixaOp.valorRestante = valorParcela;
        caixaOp.nota = notaSaved._id;
        caixaOp.estoque = estoqueSaved._id;
        caixaOp.vencimento = moment().add((iParcela+1) * 30, 'days');

        console.log(caixaOp)
        let op = await caixaOp.save();
        iParcela += 1;
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
