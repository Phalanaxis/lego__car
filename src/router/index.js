import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "defaultLayout",
    component: () => import("../layouts/defaultLayout.vue"),
    children: [
      {
        path: "/",
        name: "HomeView",
        component: () => import("../views/HomeView.vue"),
      },
      {
        path: "/notes/:id",
        name: "IdView",
        component: () => import("../views/NoteId.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
