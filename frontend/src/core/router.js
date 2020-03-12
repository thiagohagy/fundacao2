import Vue from 'vue';
import Router from 'vue-router';
import ls from 'local-storage';


// lazy loading
// DEFAULT
/* eslint-disable global-require */
const Home = (resolve) => {
  require.ensure(['./../components/Home.vue'], () => {
    resolve(require('././../components/Home.vue'));
  });
};

const Login = (resolve) => {
  require.ensure(['./../components/auth/Login.vue'], () => {
    resolve(require('././../components/auth/Login.vue'));
  });
};


const UsersForm = (resolve) => {
  require.ensure(['./../components/users/Form.vue'], () => {
    resolve(require('././../components/users/Form.vue'));
  });
};


// CLIENTS
const Fazenda = (resolve) => {
  require.ensure(['./../components/fazendas/Home.vue'], () => {
    resolve(require('././../components/fazendas/Home.vue'));
  });
};

const FazendaForm = (resolve) => {
  require.ensure(['./../components/fazendas/Form.vue'], () => {
    resolve(require('././../components/fazendas/Form.vue'));
  });
};

/* eslint-enable global-require */


Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Início',
      component: Home,
      meta: {
        humanName: 'Início',
        pathAlias: 'Início',
        showOnNav: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        humanName: 'Login',
        pathAlias: 'Users / Login',
      },
    },
    {
      path: '/users',
      component: {
        render(c) { return c('router-view') } /// then I dont need a parent component file
      },
      meta: {
        humanName: 'Users',
      },
      children: [
        {
          path: 'form/:id?',
          name: 'UsersForm',
        },
      ],
    },
    {
      path: '/fazenda',
      component: {
        render(c) { return c('router-view') } /// then I dont need a parent component file
      },
      meta: {
        humanName: 'Fazendas',
        showOnNav: true,
      },
      children: [
        {
          path: '',
          name: 'Fazendas',
          component: Fazenda,
          meta: {
            humanName: 'Listagem',
            pathAlias: 'Fazendas / Listagem',
            showOnNav: true,
          },
        },
        {
          path: 'form/:id?',
          props: true, // pass paramas as props, then you dont need to use $watch
          name: 'FazendaForm',
          component: FazendaForm,
          meta: {
            humanName: 'Formulário',
            pathAlias: 'Fazendas / Formulário',
            showOnNav: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = ls('token');
  if (!token && (to.name !== 'Login')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
