import { createRouter, createWebHistory } from 'vue-router'
import { ref, onUpdated, getTransitionRawChildren } from 'vue';

// import Map from '../components/Map.vue'
import Main from '../components/Main.vue'
import Login from '../components/Login.vue'
import FoodMap from '../components/FoodMap.vue'
import Hospitalmap from '../components/Hospital.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      name:"login",
      component : Login
    },
    {
      path: "/main",
      name: "main",
      component : Main
    },
    {
      path: "/main/foodmap",
      name: "foodmap",
      component : FoodMap
    },
    {
      path: "/main/hospitalmap",
      name: "hospitalmap",
      component : Hospitalmap
    },

    // {
    //   // path : 라우트를 호출할 경로를 나타내는 것으로 path에 해당하는 컴포넌트를 routerView로 렌더링한다.
    //   path: "/map",
    //   // 라우트를 호출할 때 주로 사용되며, 특정 이름의 라우트로 이동하거나 router.push를 사용하여 해당 라우트로 이동
    //   name: "Map",
    //   // 라우트가 호출되면 렌더링할 컴포넌트를 등록한다.
    //   component : Map
    // }
  ]
})

export default router
