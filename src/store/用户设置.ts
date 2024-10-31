import { I领域 } from "@/types/喧嚣/事项";
import { I用户设置 } from "@/types/喧嚣/设置";
import { atom } from "jotai";

export const 用户设置Atom = atom<I用户设置>({
  笔记本ID: "",
  是否使用中: false,
  日记根文档ID: "",
  默认领域: "",
});

export const 领域设置Atom = atom<I领域[]>([]);
