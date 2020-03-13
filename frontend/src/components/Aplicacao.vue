<template>
    <div>
        <div class="card">
            <div class="card-header">
              <h4>Nova Aplicação de produtos</h4>
            </div>
            
            <div class="card-body">

                <p>1 - Selecione os produtos que deseja aplicar no talhão</p>

                <div class="col-12">

                    <div class="alert alert-warning" v-if="form.estoque.length == 0">
                        Nenhum produto em estoque
                    </div>
                    
                    <div class="row form-group " v-if="form.estoque.length > 0">
                        <table class="table col table-sm table-boredered table-striped" >
                            <thead class="table-dark">
                                <tr>
                                    <th>x</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Valor unitário</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(item, index) in form.estoque" :key="index">
                                    <td>
                                        <div class="col">
                                            <input type="checkbox" v-model="item.selected" class="form-check-input " id="index">
                                        </div>
                                    </td>
                                    <td>{{item.produto}}</td>
                                    <td>{{item.qtd}}</td>
                                    <td>{{item.vlrUnitario | money}}</td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>


                <p>2 - Selecione a porcentagem que deseja aplicar</p>

                <div class="form-group">
                    <input type="number" class="form-control" placeholder="50%" v-model="form.porcentagemAplicacao">
                </div>
                
                
                <p>3 - Selecione a fazenda</p>

                <b-form-group id="nameLabel" >
                    <select name="venc" v-model="form.fazendaSelecionada" class="form-control pb-0">
                        <option v-for="(fazenda, key) in form.fazendas" :key="key" :value="fazenda">{{fazenda.name}} - {{fazenda.talhoes.length}} talhões</option>
                    </select>
                </b-form-group>

               
                <p>4 - Selecione o talhão onde deseja aplicar o produto</p>
                <b-form-group id="nameLabel"  v-if="form.fazendaSelecionada.talhoes.length > 0">
                    <select name="venc" v-model="form.talhaoSelecionado" class="form-control pb-0" multiple>
                      <option v-for="(talhao, key) in form.fazendaSelecionada.talhoes" :key="key" :value="talhao">{{talhao.nome}}</option>
                    </select>
                </b-form-group>

            </div>

            <div class="card-footer text-center">
                <button class="btn btn-md btn-danger mr-3" @click="$emit('close')">
                    Fechar
                </button>
                <button class="btn btn-success btn-md " @click="confirmaAplicacao()">
                    Confirmar aplicação
                </button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  data() {
    return {
      form: {
        porcentagemAplicacao: 0,
        estoque: [],
        talhaoSelecionado: [],
        fazendaSelecionada: {
          talhoes: [],
        }
      },
    }
  },
  mounted() {
    this.fetchEstoque();
  },
  methods: {
    async fetchEstoque() {
      const dados = await this.$http.get('v1/operacoes/getDadosAplicacao');
      this.form.estoque = dados.estoque;
      this.form.fazendas = dados.fazendas;
    },  
    async confirmaAplicacao() {
      const produtosSelecionados = this.form.estoque.filter(o => o.selected);

      if (
        produtosSelecionados.length > 0 &&
        this.form.talhaoSelecionado.length >= 1 &&
        this.form.porcentagemAplicacao > 0
      ) {
        const dataSend = {
          produtosSelecionados,
          talhaoSelecionado: this.form.talhaoSelecionado,
          porcentagemAplicacao: this.form.porcentagemAplicacao,
          fazendaSelecionada: this.form.fazendaSelecionada,
        };
          
        const response = await this.$http.post('v1/operacoes/aplicacao', dataSend);

        if (response.success) { 
          this.$toasted.show('Aplicação concluída', { icon: 'check', type: 'success' });
          this.$emit('close');
        } else {
          this.$toasted.show(response.err, { icon: 'times', type: 'error' });
        }
      } else {
        this.$toasted.show('Selecione pelo menos um produto do estoque e informe a % de aplicação', { icon: 'times', type: 'error' });
      }
 
    }
  },
}
</script>