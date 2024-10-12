import { atom } from "jotai";

export const 用户设置Atom = atom<{
  笔记本: string;
}>({
  笔记本: undefined,
});
