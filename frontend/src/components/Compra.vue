<template>
    <div>
        <div class="card">
            <div class="card-header">
              <h4>Nova compra</h4>
            </div>
            
            <div class="card-body">
                <div class="row form-group ">
                    <div class="col-12">
                        <b-form-group id="nameLabel" label="Vencimento:" label-for="" >
                            <select name="venc" v-model="form.tipoVencimeto" class="form-control pb-0">
                                <option value="1">Para 30 dias</option>
                                <option value="2">Para 30 e 60 dias</option>
                                <option value="3">Para 30, 60 e 90 dias</option>
                            </select>
                        </b-form-group>

                        <b-form-group id="emailLabel" label="Notas adicionadas:" label-for="email">
                            <div class="alert alert-warning" v-if="form.notas.length == 0">
                                Nenhuma nota adicionada, adicione nos botões abaixo
                            </div>

                            <table class="table col" >
                                <thead>
                                    <tr>
                                        <th>Fornecedor</th>
                                        <th>Nota</th>
                                        <th>Dt Compra</th>
                                        <th>Ano</th>
                                        <th>Dt Venci</th>
                                        <th>Safra</th>
                                        <th>Desc</th>
                                        <th>Item</th>
                                        <th>Qtd</th>
                                        <th>Unidade</th>
                                        <th>R$ unitario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(nota, index) in form.notas" :key="index">
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.fornecedor">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.nota">
                                          
                                        </td>
                                        <td>
                                          <input type="date" class="form-control p-1" v-model="nota.dataCompra">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.ano">
                                          
                                        </td>
                                        <td>
                                          <input type="date" class="form-control p-1" v-model="nota.dataVencimento">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.safra">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.item">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.descricao">
                                          
                                        </td>
                                        <td>
                                          <input type="number" class="form-control p-1" v-model="nota.quantidade">
                                          
                                        </td>
                                        <td>
                                          <input type="text" class="form-control p-1" v-model="nota.unidade">
                                        </td>
                                        <td>  
                                          <money v-model="nota.valorUnitario" ></money> 
                                        </td>
                                    </tr>
                                   
                                </tbody>
                            </table>

                        </b-form-group>

                        <div class="text-right">
                            <button class=" btn btn-sm btn-info mr-2" @click="addNotaManual()">Add nota manual</button>
                            <button class=" btn btn-sm btn-info mr-2" @click="alert('Modal para informar nr da nota, entao buscar na receita os dados')">Importar nota</button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="card-footer text-center">
                <button class="btn btn-md btn-danger mr-3" @click="$emit('close')">
                    Fechar
                </button>
                <button class="btn btn-success btn-md " @click="confirmaCompra()">
                    Confirmar compra
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
        tipoVencimeto: 1,
        notas: [],
      },
    }
  },
  methods: {
    alert(msg) {
      alert(msg);
    },
    addNotaManual() {
      this.form.notas.push({
        fornecedor: 'Frisia',
        nota: '123',
        dataCompra: new Date(),
        ano: '2020',
        dataVencimento: new Date(),
        safra: '2020/2020',
        item: 'Teste',
        descricao: 'Teste',
        quantidade: 5,
        unidade: 'Kg',
        valorUnitario: 15.00,
      });
    },
    async confirmaCompra() {
      if (this.form.notas.length > 0) {
        const response = await this.$http.post('v1/operacoes/compra', this.form);

        if (response.success) {
          this.$toasted.show('Compra concluída', { icon: 'check', type: 'success' });
          this.$emit('close');
        } else {
          this.$toasted.show(response.err, { icon: 'times', type: 'error' });
        }
      } else {
        this.$toasted.show('Adicione pelo menos uma nota', { icon: 'times', type: 'error' });
      }
    }
  },

  mounted() {
      
  },
}
</script>