<template>
  <div class="row">

    <div class="col-12 text-center m-4">
      <h3>Saldo disponível: {{saldo | money}}</h3>

      <hr>
    </div>
    
    <div class="col-sm">
      <h4>Estoque <font-awesome-icon icon="box" /></h4>
      <p><small>Produtos disponíveis para aplicação</small></p>

      <div class="col-12 mb-4">
        <button class="col-4 btn btn-md btn-success mr-4" @click="novaCompra()" >Nova Compra</button>
      </div>
      

      <div v-if="estoque.length==0" class="alert alert-warning">
        Nenhum registro encontrado
      </div>

      <table class="table table-bordered table-striped" v-if="estoque.length > 0">
        <thead class="table-dark">
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor un.</th>
            <th>Valor total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,key ) in estoque" :key="key">
            <td>{{ item.produto}}</td>
            <td>{{ item.qtd }} {{item.nota.unidade}}</td>
            <td>{{ item.vlrUnitario | money }}</td>
            <td>{{ item.vlrUnitario * item.qtd | money }}</td>
          </tr>

        </tbody>
      </table>
    </div>

    <div class="col-sm">
      <h4>Fazendas/Talhões <font-awesome-icon icon="leaf" /></h4>
      <p><small>Fazendas cadastradas para aplicação</small></p>

      <div class="col-12 mb-4">
        <button class="col-4 btn btn-md btn-warning" @click="novaAplicacao()" >Fazer Aplicação</button>
      </div>

      <div v-if="fazendas.length==0" class="alert alert-warning">
        Nenhum registro encontrado
      </div>


      <table class="table table-bordered table-striped" v-if="fazendas.length > 0">
        <thead class="table-dark">
          <tr>
            <th>Fazenda</th>
            <th>Área</th>
            <th>Total talhões</th>
            <th>Opção</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fazenda, key) in fazendas" :key="key" >
            <td>{{ fazenda.name }}</td>
            <td>{{ fazenda.area }} hec</td>
            <td>{{ fazenda.talhoes.length }}</td>
            <td>
              <button class=" btn btn-sm btn-info" @click="detalheFazenda(fazenda._id)">
                Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col-12 mb-5">
      <hr>

      <h4>Dívidas <font-awesome-icon icon="money-bill-wave" /></h4>
      
      <p><small>Extrato das divídas das aplicações</small></p>
      <div v-if="movimentacoes.length==0" class="alert alert-warning">
        Nenhum registro encontrado
      </div>

      <table class="table table-bordered table-striped" v-if="movimentacoes.length > 0">
        <thead class="table-dark">
          <tr>
            <th>Nr nota</th>
            <th>Produto</th>
            <th>Vencimento</th>
            <th>Valor total</th>
            <th>Valor pago</th>
            <th>Opção</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(mov, key) in movimentacoes" 
            :key="key" 
            :class="{
              paid: mov.valorPago == mov.valorTotal,
              delayed: checkDelay(mov)
             }" >
            <td>{{ mov.nota.nota }}</td>
            <td>{{ mov.estoque.produto }}</td>
            <td>{{ mov.vencimento | date}}</td>
            <td>{{ mov.valorTotal | money }}</td>
            <td>{{ mov.valorPago | money }}</td>
            <td>
              <button v-if="mov.valorPago != mov.valorTotal" class=" btn btn-sm btn-info" @click="efetuaPagamento(mov._id)">
                Efetuar pagamento
              </button>

              <span class="alert-paid" v-if="mov.valorPago == mov.valorTotal">Pagamento conluído</span>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
import CompraModal from './Compra.vue';
import AplicacaoModal from './Aplicacao.vue';
import PagamentoModal from './Pagamento.vue';
import DetalheFazendaVue from './fazendas/DetalheFazenda.vue';
import moment from 'moment';

export default {
  name: 'home',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      movimentacoes: [],
      fazendas: [],
      estoque: [],
      saldo: 0,
    }
  },
  methods: {
    checkDelay(mov) {
      return moment().isAfter(mov.vencimento) && mov.valorTotal !== mov.valorPago;
    },
    novaCompra() {
      const app = this;
      this.$modal.show( CompraModal, {
      }, {
        width: '95%',
        height: 'auto',
        clickToClose: false,
      }, {
        'closed': () => { app.fetchData() }
      })
    },
    novaAplicacao() {
      const app = this;
      this.$modal.show(AplicacaoModal, {
      }, {
        width: '60%',
        height: 'auto',
        clickToClose: false,
      }, {
        'closed': () => { app.fetchData() }
      })
    },
    detalheFazenda(id) {
      const app = this;
      this.$modal.show(DetalheFazendaVue,
        {
          id,
        }, {
          width: '60%',
          height: 'auto',
          clickToClose: false,
        }, {
          'closed': () => { app.fetchData() }
        }
      )
    },
    efetuaPagamento(id) {
      const app = this;
      this.$modal.show(PagamentoModal,
        {
          fluxoId: id,
        },
        {
          width: '40%',
          height: 'auto',
          clickToClose: false,
        }, {
          'closed': () => { app.fetchData() }
        }
      )
    },
    async fetchData() {
      const response = await this.$http.post('v1/operacoes/');

      this.movimentacoes = response.fluxos;
      this.fazendas = response.fazendas;
      this.estoque = response.estoques;
      this.saldo = response.saldo;
}
  },
  mounted() {
    this.fetchData();
  },
};
</script>


<style>
  .paid {
    background-color: lightgreen !important;
    color: darkgreen;
  }

  .alert-paid {
    background-color: white;
    color: darkgreen;
    padding: 10px;
    text-transform: uppercase;
  }
  
  .delayed {
    background-color: lightcoral !important;
    color: white;
  }
</style>