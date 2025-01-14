import { atom, createStore } from "jotai";

export const storeAtom = atom<{
  load: (键: string) => Promise<any>;
  save: (键: string, 数据: any) => Promise<Boolean>;
}>();

export const 仓库 = createStore();
