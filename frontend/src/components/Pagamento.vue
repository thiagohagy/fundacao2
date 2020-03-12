<template>
    <div>
        <div class="card">
            <div class="card-header text-center">
              <h4>Pagamento de dívida</h4>
            </div>
            
            <div class="card-body">

            <p class="text-center">Informe quanto da dívida deseja pagar (em %)</p>

              <div class="form-group ">
                  <input type="number" max="100" min="0" class="form-control" placeholder="Ex: 50% " v-model="porcentagemPagamento">
              </div>
            </div>

            <div class="card-footer text-center">
                <button class="btn btn-md btn-danger mr-3" @click="$emit('close')">
                    Fechar
                </button>
                <button class="btn btn-success btn-md " @click="confirmaPagamento()">
                    Confirmar pagamento
                </button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  props: ['fluxoId'],
  data() {
    return {
      porcentagemPagamento: false,
    }
  },
  methods: {
    async confirmaPagamento() {

      if (this.fluxoId && this.porcentagemPagamento > 0 && this.porcentagemPagamento <= 100) {
        const dataSend = {
          porcentagemPagamento: this.porcentagemPagamento,
          fluxoId: this.fluxoId,
        };
  
        const response = await this.$http.post('v1/operacoes/pagamento', dataSend);
  
        if (response.success) {
          this.$toasted.show('Pagamento concluído', { icon: 'check', type: 'success' });
          this.$emit('close');
        } else {
          this.$toasted.show(response.err, { icon: 'times', type: 'error' });
        }
      } else {
        this.$toasted.show('Informe uma porcentagem de pagamento entre 1 e 100', { icon: 'times', type: 'error' });
      }
    }
  },
}
</script>