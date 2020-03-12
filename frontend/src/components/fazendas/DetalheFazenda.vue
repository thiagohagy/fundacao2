<template>
    <div>
        <div class="card">
            <div class="card-header">
              <h4>Detalhes da fazenda</h4>
            </div>
            <div class="card-body">
              <label>Nome da fazenda: </label>
              <h4>{{form.name}}</h4>

              <label class="mt-3">Área da fazenda (hectares): </label>
              <h4>{{form.area}}</h4>

              <label class="mt-3">Talhoes (hectares): </label>
              <table class="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Custo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(talhao, key) in form.talhoes " :key="key">
                    <td>{{talhao.nome}}</td>
                    <td>{{talhao.custo | money}}</td>
                  </tr>
                </tbody>
              </table>
              
            </div>

            <div class="card-footer text-center">
                <button class="btn btn-md btn-danger mr-3" @click="$emit('close')">
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  props:['id'],
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.fetchDetalhes();
  },
  methods: {
    async fetchDetalhes() {
      const response = await this.$http.get(`v1/fazendas/${this.id}`);
      this.form = response;
    },
  },
}

</script>