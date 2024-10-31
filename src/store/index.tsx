import { atom, createStore } from "jotai";

export const 持久化atom = atom<{
  加载: (键: string) => void;
  保存: (键: string, 数据: any) => void;
}>();

export const 仓库 = createStore();
