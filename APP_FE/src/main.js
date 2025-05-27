import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'; 
import App from './App.vue';
import UserRegister from './components/user/UserRegister.vue';
import UserLogin from './components/user/UserLogin.vue';
import StoreAdd from './components/store/StoreAdd.vue';
import StoreList from './components/store/StoreList.vue';
import StorePage from './components/store/StorePage.vue';
import StoreCars from './components/store/StoreCars.vue';
import StoreEdit from './components/store/StoreEdit.vue';
import UserDashboard from './components/user/UserDashboard.vue';
import CarList from './components/car/CarList.vue';
import CarModel from './components/car/CarModel.vue';
import CarEdit from './components/car/CarEdit.vue';
import CarAdd from './components/car/CarAdd.vue';
import EmployeeList from './components/employee/EmployeeList.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        name: 'register',
        path: '/register',
        component: UserRegister,
        meta: {},
      },
      {
        name: 'login',
        path: '/',
        component: UserLogin,
        meta: {},
      },
      {
        name: 'store-add',
        path: '/store/add', 
        component: StoreAdd,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'store-list',
        path: '/store/list', 
        component: StoreList,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'store-page',
        path: '/store/page/:nome',
        component: StorePage,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'store-cars',
        path: '/store/cars/:nome/:brand',
        component: StoreCars,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'store-edit',
        path: '/store/edit/:nome',
        component: StoreEdit,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'user-dashboard',
        path: '/user/dashboard', 
        component: UserDashboard,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'car-list',
        path: '/car/list', 
        component: CarList,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'car-model',
        path: '/car/model/:brand', 
        component: CarModel,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'car-edit',
        path: '/car/edit/:licensePlate', 
        component: CarEdit,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'car-add',
        path: '/car/add', 
        component: CarAdd,
        meta: { allowedRoles: ["employee"] },
      },
      {
        name: 'employee-list',
        path: '/employee/list', 
        component: EmployeeList,
        meta: { 
          requiresAuth: true,
          allowedRoles: ["admin"]
        },
      },
    ],
  });

const app = createApp(App);
app.use(router);
app.mount('#app');