import Home from "../pages/home/Page";
import PageNotFound from "../pages/PageNotFound/Page";
import Todos from "../pages/todos/Page";
import CompletedTodos from "../pages/todos/completed/Page";
import IncompletedTodos from "../pages/todos/incomplete/Page";

const Pages = [
  {
    path: "/",
    label: "Home",
    component: Home(),
    title: "Home",
    found: true,
  },
  {
    path: "*",
    label: "PageNotFound",
    component: PageNotFound(),
    title: "PageNotFound",
    found: false,
  },
  {
    path: "/todos",
    label: "Todos",
    component: Todos(),
    title: "Todos",
    found: true,
  },
  {
    path: "/todos/completed",
    label: "Completed",
    component: CompletedTodos(),
    title: "Completed",
    found: true,
  },
  {
    path: "/todos/incomplete",
    label: "Incompleted",
    component: IncompletedTodos(),
    title: "Incompleted",
    found: true,
  },
];

export default Pages;
