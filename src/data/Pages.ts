import { RouteConfig } from "./Types";

import PageNotFound from "../pages/PageNotFound/Page";
import Todos from "../pages/todos/Page";
import CompletedTodos from "../pages/todos/completed/Page";
import IncompleteTodos from "../pages/todos/incomplete/Page";
import Categories from "../pages/categories/Page";

export const Pages: RouteConfig[] = [
  {
    path: "/",
    title: "Home",
    component: Todos
  },
  {
    path: "/completed",
    title: "Completed",
    component: CompletedTodos
  },
  {
    path: "/incomplete",
    title: "Incomplete",
    component: IncompleteTodos
  },
  {
    path: "/categories",
    title: "Categories",
    component: Categories
  }
];

export const PageNotFoundRoute: RouteConfig = { path: "*", title: "Page Not Found", component: PageNotFound };