<template>
  <div class="wrapper">

    <b-navbar toggleable="md" type="dark" variant="info"  class="navbar navbar-expand-lg mb-3" v-if="isLogged">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">
        <router-link to="/" class="navbar-brand"><img src="./../../assets/logo.png"  width="100px"/>  </router-link>
      </b-navbar-brand>

      <b-navbar-nav id="myBredcrumb">
        <b-nav-text >
          {{breadcrumb}}
        </b-nav-text>
      </b-navbar-nav>

      <b-collapse is-nav id="nav_collapse">

        <!-- simples routes -->
        <b-navbar-nav>
          <b-nav-item
          href="#"
          class="nav-item"
          v-for="link in links"
          :key='link.name'
          v-if='!link.children && link.meta.showOnNav'>
            <router-link :to="{ name: link.name }" class="nav-link">{{link.meta.humanName}}</router-link>
          </b-nav-item>
        </b-navbar-nav>

        <!-- nested routes -->
        <b-navbar-nav>
          <b-nav-item-dropdown
            class="nav-item"
            :text="link.meta.humanName"
            v-for="link in links"
            :key='link.name'
            v-if='link.children && link.meta.showOnNav'
          >
            <b-dropdown-item
              href="#"
              v-for="sublink in link.children"
              v-if='sublink.meta.showOnNav'
              :key='sublink.name'
            >
              <router-link :to="{ name: sublink.name }" class="nav-link dropdown-nav-link">{{sublink.meta.humanName}}</router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto ">
          <b-nav-item id="profileDropdown" class="mt-2">
              <b-nav-item-dropdown class="nav-item" :text="decoded.name || decoded.login" right> 
              <b-dropdown-item href="#">
                <router-link :to="{ name: 'UsersForm', params:{ id: decoded._id } }" class="nav-link dropdown-nav-link">Meus dados</router-link>
              </b-dropdown-item>

              <b-dropdown-item href="#" @click="logout()">
                <div class="nav-link dropdown-nav-link">
                  Logout
                  <font-awesome-icon icon="sign-out-alt" />
                </div>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>
          
          <b-nav-item id="profileDropdown">
            <img rounded="circle" width="55" height="55" class="m-1 nomargin rounded-circle img" :src='getFile()' >
          </b-nav-item>
        </b-navbar-nav>


      </b-collapse>
    </b-navbar>

    <slot></slot>

  </div>
</template>

<script>
import store from '@/store';
import jwtDecode from 'jwt-decode';

export default {
  name: 'app-nav',
  data() {
    return {
      links: [],
      breadcrumb: '',
      token: {},
      api: '',
      decoded: '',
    };
  },
  methods: {
    logout() {
      this.$store.commit('user_logout');
    },
    getFile() {
      if (this.decoded && this.decoded.avatar) {
        let file = `${this.api}/api/v1/upload?`;
        file += `token=${this.token}`;
        file += `&mimetype=${this.decoded.avatar.mimetype}`;
        file += `&filename=${this.decoded.avatar.filename}`;
        file += `&folder=${this.decoded.avatar.folder}`;

        return file;
      }

      return './../../assets/userPlaceholder.png';
    }
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  mounted() {
    this.api = process.env.VUE_APP_API;
    this.links = this.$router.options.routes;
    this.decoded = jwtDecode(this.$store.getters.authToken);
    this.token = this.$store.getters.authToken;
  },
  watch: {
    '$route' (to, from) {
      this.breadcrumb = this.$route.meta.pathAlias;
    }
  }
};
</script>

<style scoped>

#myBredcrumb{
  position: absolute;
  top: 50px;
  left: 170px;
}
#myBredcrumb span {
  font-weight: 100;
  font-size: 11px;
  color: #fff
}
.collapse{
  width: 100%
}

.nomargin {
  margin:0px;
  padding:0px;
}

#nav_collapse{
  margin-right:0px;
  padding-right:0px;
}

#profileDropdown{
  margin-right: 0px;
  padding-right: 0px;
  color: black !important
}

#profileDropdown .nav-item {
  margin: 0px;
}


</style>
