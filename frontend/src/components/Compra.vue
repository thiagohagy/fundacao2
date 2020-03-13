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
                                        <th>Item</th>
                                        <th>Desc</th>
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
                                          <the-mask :mask="['##/##/####']" v-model="nota.dataCompra" class="form-control p-1"/>
                                        </td>
                                        <td>
                                          <the-mask :mask="['####']" v-model="nota.ano" class="form-control p-1"/>
                                        </td>
                                        <td>
                                          <the-mask :mask="['##/##/####']" v-model="nota.dataVencimento" class="form-control p-1"/>
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
                                          <money v-model="nota.valorUnitario" class="form-control p1" ></money>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                        </b-form-group>

                        <div class="text-right">
                            <button class=" btn btn-sm btn-info mr-2" @click="addNotaManual()">Add nota manual</button>

                            <label id="carregaArquivo"  for="file-upload" class="btn btn-sm btn-info mt-2">
                              Importar de arquivo
                              <font-awesome-icon icon="file" class="pointer" />
                            </label>
                            <input id="file-upload" type="file" style="display: none" ref="myFile" accept="text/csv" @change="choseFile"/>

                            <button class=" btn btn-sm btn-info mr-2" @click="alert('Modal para informar nr da nota, entao buscar na receita os dados')">Importar nota da RF</button>
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

import axios from 'axios';

export default {
  data() {
    return {
      form: {
        tipoVencimeto: 1,
        notas: [],
      },
      fileSelected: {},
    }
  },
  methods: {
    choseFile(e) {
      this.fileSelected = e.target.files[0];
      let formData = new FormData();
      formData.append('file', this.fileSelected);
      formData.append('folder', 'notas');
      const app = this;

      axios.post(`${process.env.VUE_APP_API}/api/v1/upload`,
        formData,
        {
          headers: {
            Authorization: this.$store.getters.authToken,
            'Content-Type': 'multipart/form-data',
          }
        }
      ).then( async (res) => {
        if (res.data && res.data.file && res.data.file.filename) {
          app.extractNotas(res.data.file);
        } else {
          this.$toasted.show('Erro ao enviar arquivo', { icon: 'times', type: 'error' });
        }
      }).catch(() => {
        this.$toasted.show('Erro ao enviar arquivo', { icon: 'times', type: 'error' });
      });
    },
    async extractNotas(file) {
      const response = await this.$http.post('v1/operacoes/extractNotas', file);

      for (let inota = 0; inota < response.notas.length; inota++) {
        const notaImportada = response.notas[inota];

        this.form.notas.push({
          fornecedor: notaImportada[0],
          nota: notaImportada[1],
          dataCompra: notaImportada[2],
          ano: notaImportada[3],
          dataVencimento: notaImportada[4],
          safra: notaImportada[5],
          item: notaImportada[6],
          descricao: notaImportada[7],
          quantidade: notaImportada[8],
          unidade: notaImportada[9],
          valorUnitario: notaImportada[10],
        });
      }
    },
    alert(msg) {
      alert(msg);
    },
    addNotaManual() {
      this.form.notas.push({
        fornecedor: '',
        nota: '',
        dataCompra: new Date(),
        ano: '',
        dataVencimento: new Date(),
        safra: '',
        item: '',
        descricao: '',
        quantidade: 0,
        unidade: '',
        valorUnitario: 0,
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

<style>
  #carregaArquivo {
    margin-top: 9px !important;
    margin-right: 8px;
  }

</style>