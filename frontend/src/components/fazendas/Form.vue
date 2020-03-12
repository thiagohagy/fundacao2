<template>
  <div class="container text-left" >

    <div class="text-center">
      <h3>{{ pageTitle }}</h3>
    </div>

    <form>

      <div class="row">
        <div class="col-12">
          <b-form-group id="nameLabel" label="Nome da fazenda:" label-for="name" >
            <b-form-input id="name" type="text" v-model="form.name"  placeholder="Nome da fazenda"></b-form-input>
          </b-form-group>
         
          <b-form-group id="nameLabel" label="Área:" label-for="name" >
            <b-form-input id="name" type="number" v-model="form.area"  placeholder="Área em hectares"></b-form-input>
          </b-form-group>
          
          
          
          <b-form-group id="nameLabel" label="Talhões:" label-for="name" >
            <b-form-input v-for="(talhao, key) in form.talhoes" :key="key" id="name" type="text" v-model="talhao.nome"  placeholder="Nome do talhão"></b-form-input>
          </b-form-group>

          <div class="text-right">
            <button  type="button" class="btn btn-sm btn-info " @click="form.talhoes.push({ nome: 't' + (form.talhoes.length+1) })">Add talhão</button>
          </div>

        </div>
      </div>

      <div class="text-center">
        <b-button type="button" variant="primary" @click="onSubmit" >Confirmar</b-button>
        <router-link to="/fazenda">
          <b-button type="reset" variant="danger"  >
            Cancelar
          </b-button>
        </router-link>
      </div>
    </form>
  </div>

</template>

<script>


  export default {
    props:['id'],
    data() {
      return {
        form:{
          name: 'teste',
          talhoes: [{}],
        },
        pageTitle: 'Client registration',
      }
    },
    methods: {
      async onSubmit(){
        if (this.form._id) {
           if ( this.form.name) {
            let response = await this.$http.put('v1/fazendas', this.form); // request with async await

            if (response.success) {
              this.$toasted.show('Fazenda editada com sucesso',{icon:'check', type: 'success'});
              this.$router.push({name: "Fazendas"});
            } else {
              this.$toasted.show(response.err ,{icon:'times', type: 'error'});
            }
          } else {
            this.$toasted.show('Informe o nome e os talhões',{icon:'times', type: 'error'})
          }
        } else {

          if ( this.form.name ) {
            let response = await this.$http.post('v1/fazendas', this.form); // request with async await

            if (response.success) {
              this.$toasted.show('Cadastro cuncluido',{icon:'check', type: 'success'});
              this.$router.push({name: "Fazendas"});
            } else {
              this.$toasted.show(response.err ,{icon:'times', type: 'error'});
            }
          } else {
            this.$toasted.show('Informe o nome da fazenda',{icon:'times', type: 'error'})
          }
        }
      },
    },
    async mounted() {
      if (this.id) {
        this.pageTitle =  'Edição de fazenda';
        let response = await this.$http.get(`/v1/fazendas/${this.id}`);
        if (response._id) {
          delete response.password;
          this.form = this.form = response;
        } else {
          this.$toasted.show('An error has ocurred' ,{icon:'times', type: 'error'});
        }
      }
    },
  }
</script>



