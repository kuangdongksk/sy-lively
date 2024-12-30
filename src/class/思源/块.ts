import { EAPI } from "@/constant/API路径";
import { fetchSyncPost } from "siyuan";

export class SY块 {
  /**
   * 插入块
   * @param options - 包含以下属性的对象：
   *   - dataType: 待插入数据类型，值可选择 markdown 或者 dom
   *   - data: 待插入的数据
   *   - nextID: 后一个块的 ID，用于锚定插入位置
   *   - previousID: 前一个块的 ID，用于锚定插入位置
   *   - parentID: 父块 ID，用于锚定插入位置
   *
   * nextID、previousID、parentID 三个参数必须至少存在一个有值，
   * 优先级为 nextID > previousID > parentID
   * @returns 插入块的结果
   */
  public static async 插入块(options: {
    dataType: "markdown" | "dom";
    data: string;
    nextID?: string;
    previousID?: string;
    parentID?: string;
  }) {
    const { data } = await fetchSyncPost(EAPI.插入块, options);
    return data[0].doOperations[0].id;
  }

  /**
   * 插入前置子块
   * @param options - 包含以下属性的对象：
   *   - dataType: 待插入数据类型，值可选择 markdown 或者 dom
   *   - data: 待插入的数据
   *   - parentID: 父块 ID
   * @returns 插入块的结果
   */
  public static 插入前置子块(options: {
    dataType: "markdown" | "dom";
    data: string;
    parentID: string;
  }): Promise<{
    data: {
      doOperations: {
        action: "insert";
        data: string;
        id: string;
        parentID: string;
        previousID: string;
        nextID: string;
        retData: null;
        blockIDs: null;
        blockID: string;
        deckID: "";
        avID: "";
        srcIDs: null;
        srcs: null;
        isDetached: false;
        ignoreFillFilter: false;
        name: string;
        type: string;
        format: string;
        keyID: string;
        rowID: string;
        isTwoWay: false;
        backRelationKeyID: string;
      }[];
    }[];
  }> {
    return fetchSyncPost(EAPI.插入前置子块, options) as any;
  }

  /**
   * 插入后置子块
   * @param options - 包含以下属性的对象：
   *   - dataType: 待插入数据类型，值可选择 markdown 或者 dom
   *   - data: 待插入的数据
   *   - parentID: 父块 ID
   * @returns 插入块的结果
   */
  public static async 插入后置子块(options: {
    dataType: "markdown" | "dom";
    data: string;
    parentID: string;
  }): Promise<string> {
    const { data } = await fetchSyncPost(EAPI.插入后置子块, options);

    return data[0].doOperations[0].id;
  }

  /**
   * 更新块
   * @param options - 包含以下属性的对象：
   *   - id: 待更新块的 ID
   *   - dataType: 待更新数据类型，值可选择 markdown 或者 dom
   *   - data: 待更新的数据
   * @returns 更新块的结果
   */
  public static 更新块(options: {
    id: string;
    dataType: "markdown" | "dom";
    data: string;
  }) {
    return fetchSyncPost(EAPI.更新块, options);
  }

  /**
   * 删除块
   * @returns 删除块的结果
   */
  public static 删除块(ID: string) {
    return fetchSyncPost(EAPI.删除块, {
      id: ID,
    });
  }

  /**
   * 移动块
   * @param options - 包含以下属性的对象：
   *   - id: 待移动块的 ID
   *   - parentID: 父块的 ID，用于锚定插入位置
   *   - previousID: 后一个块的 ID，用于锚定插入位置（可选）
   * @returns 移动块的结果
   */
  public static 移动块(options: {
    id: string;
    previousID?: string;
    parentID?: string;
  }) {
    return fetchSyncPost(EAPI.移动块, options);
  }

  /**
   * 获取块 Kramdown 源码
   * @param id: 待获取块的 ID
   * @returns 块的 Kramdown 源码
   */
  public static 获取块Kramdown源码(id: string) {
    return fetchSyncPost(EAPI.获取块kramdown源码, {
      id,
    });
  }

  /**
   * 获取子块
   * @param id: 父块的 ID
   * 标题下方块也算作子块
   * @returns 子块列表
   */
  public static 获取子块(id: string) {
    return fetchSyncPost(EAPI.获取子块, { id });
  }

  /**
   * 转移块引用
   * @param options - 包含以下属性的对象：
   *   - fromID: 定义块 ID
   *   - toID: 目标块 ID
   *   - refIDs: 指向定义块 ID 的引用所在块 ID，可选，如果不指定，所有指向定义块 ID 的引用块 ID 都会被转移
   * @returns 转移块引用的结果
   */
  public static 转移块引用(options: {
    fromID: string;
    toID: string;
    refIDs?: string[];
  }) {
    return fetchSyncPost(EAPI.转移块引用, options);
  }

  /**
   * 设置块属性
   * @param options - 包含以下属性的对象：
   *   - id: 待设置块的 ID
   *   - attrs: 待设置的属性
   * @returns 设置块属性的结果
   */
  public static async 设置块属性(options: {
    id: string;
    attrs: { [key: string]: string };
  }) {
    const 结果 = await fetchSyncPost(EAPI.设置块属性, options);
    return 结果;
  }

  public static async 根据ID获取笔记本ID(ID: string): Promise<string> {
    const { data } = await fetchSyncPost("/api/query/sql", {
      stmt: `SELECT * FROM blocks WHERE id='${ID}'`,
    });

    return data[0].box;
  }
}
