import { ComponentType } from "react";

export interface RouteConfig {
  path: string;
  title: string;
  component: ComponentType
}