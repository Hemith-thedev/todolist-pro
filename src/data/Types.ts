import { ComponentType } from "react";

export interface RouteConfig {
  path: string;
  title: string;
  component: ComponentType
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Todo {
  id: string;
  label: string;
  category: Category;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DropdownOptionOptions {
  id: string,
  label: string;
  color: string;
}

export interface DropdownOptions {
  placeholder: string;
  options: DropdownOptionOptions[];
  onSelect: (option: DropdownOptionOptions) => void;
}