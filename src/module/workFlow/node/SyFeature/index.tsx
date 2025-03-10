import AddCommandNode from "./AddCommandNode";
import AddSlashCommandNode from "./AddSlashCommandNode";
import AddStyleNode from "./AddStyleNode";
import AddTabNode from "./AddTabNode";
import AddTopBarNode from "./AddTopBarNode";
import LoadDataNode from "./LoadDataNode";
import SaveDataNode from "./SaveDataNode";

export enum ESyFeatureNode {
  AddCommandNode = "AddCommandNode",
  AddSlashCommandNode = "AddSlashCommandNode",
  AddStyleNode = "AddStyleNode",
  AddTabNode = "AddTabNode",
  AddTopBarNode = "AddTopBarNode",
  LoadDataNode = "LoadDataNode",
  SaveDataNode = "SaveDataNode",
}

export const SyFeatureNode = {
  AddCommandNode,
  AddSlashCommandNode,
  AddStyleNode,
  AddTabNode,
  AddTopBarNode,
  LoadDataNode,
  SaveDataNode,
};
