import { I用户设置 } from "@/types/喧嚣";
import { atom } from "jotai";

export const 用户设置Atom = atom<I用户设置>({
  笔记本ID: "",
  是否使用中: false,
  日记根文档ID: "",
  领域文档ID: "",
  领域设置: [],
});
