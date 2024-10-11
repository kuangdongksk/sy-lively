import { I事项 } from "@/components/任务树/components/事项";
import { 任务树初始值 } from "@/constant/初始值";
import { atom } from "jotai";

export const 事项数据 = atom<I事项[]>(任务树初始值);
