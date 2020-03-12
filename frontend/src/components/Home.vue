<template>
  <div class="row">

    <div class="col-12 text-center mb-4">
      <button class="col-3 btn btn-md btn-success mr-4" @click="novaCompra()" >Compra</button>
      <button class="col-3 btn btn-md btn-warning" @click="novaAplicacao()" >Aplicação</button>
    </div>

    <div class="col-12 text-center m-4">
      <h3>Saldo disponível: {{saldo | money}}</h3>
    </div>

    <div class="col-sm">
      <h4>Estoque</h4>
      
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
            <td>{{ item.qtd }}</td>
            <td>{{ item.vlrUnitario | money }}</td>
            <td>{{ item.vlrUnitario * item.qtd | money }}</td>
          </tr>
         
        </tbody>
      </table>
    </div>
    
    <div class="col-sm">
      <h4>Fazendas/Talhões</h4>
      
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
      <h4>Movimentações</h4>
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
          <tr v-for="(mov, key) in movimentacoes" :key="key" >
            <td>{{ mov.nota.nota }}</td>
            <td>{{ mov.estoque.produto }}</td>
            <td>{{ mov.vencimento | date}}</td>
            <td>{{ mov.valorTotal | money }}</td>
            <td>{{ mov.valorPago | money }}</td>
            <td>
              <button class=" btn btn-sm btn-info" @click="efetuaPagamento(mov._id)">
                Efetuar pagamento
              </button>
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
    // this.$toasted.show('Error toast', { icon: 'times', type: 'error' });
    // this.$toasted.show('Success toast', { icon: 'check', type: 'success' });
    // this.$toasted.show('Info toast', { icon: 'info', type: 'info' });
  },
};
</script>
