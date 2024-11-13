import { atom, createStore } from "jotai";

export const 持久化atom = atom<{
  加载: (键: string) => Promise<any>;
  保存: (键: string, 数据: any) => Promise<Boolean>;
}>();

export const 仓库 = createStore();
