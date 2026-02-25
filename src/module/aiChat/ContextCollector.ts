import { SY块 } from "@/class/思源/块";
import { $ } from "@/constant/三方库";
import type { IProtyle } from "siyuan";
import type {
  AIChatContext,
  BlockInfo,
  ContextCollectorConfig,
} from "./types";

/**
 * 上下文收集器
 * 用于从protyle编辑器中收集选中的文本、块等信息
 */
export class ContextCollector {
  private protyle: IProtyle;
  private focusedBlockId: string | null;

  constructor(config: ContextCollectorConfig) {
    this.protyle = config.protyle;
    this.focusedBlockId = config.focusedBlockId;
  }

  /**
   * 收集上下文
   */
  async collect(): Promise<AIChatContext> {
    const selectedText = this.getSelectedText();
    const blocks = await this.getSelectedBlocks();
    const insertTargetBlockId = this.getInsertTargetBlockId(blocks);
    const kramdown = await this.blocksToKramdown(blocks);
    const rootId = this.protyle.block.rootID || "";

    return {
      selectedText,
      blocks,
      insertTargetBlockId,
      kramdown,
      rootId,
    };
  }

  /**
   * 获取选中的文本
   */
  private getSelectedText(): string {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return "";

      return selection.toString().trim();
    } catch (e) {
      console.error("获取选中文本失败:", e);
      return "";
    }
  }

  /**
   * 获取选中的块
   * 如果没有选中块，则返回当前光标所在的块
   */
  private async getSelectedBlocks(): Promise<BlockInfo[]> {
    const blocks: BlockInfo[] = [];

    try {
      // 检查是否有选中的块（多选）
      const selectedElements = this.protyle.wysiwyg?.element.querySelectorAll(
        ".protyle-wysiwyg--select"
      );

      if (selectedElements && selectedElements.length > 0) {
        // 有多个选中的块
        for (const el of Array.from(selectedElements)) {
          const blockId = el.getAttribute("data-node-id");
          if (blockId) {
            const kramdown = await this.getKramdown(blockId);
            blocks.push({ id: blockId, kramdown });
          }
        }
      } else if (this.focusedBlockId) {
        // 没有选中块，使用当前聚焦的块
        const kramdown = await this.getKramdown(this.focusedBlockId);
        blocks.push({ id: this.focusedBlockId, kramdown });
      } else if (this.protyle.block.id) {
        // 使用protyle的当前块
        const kramdown = await this.getKramdown(this.protyle.block.id);
        blocks.push({ id: this.protyle.block.id, kramdown });
      }
    } catch (e) {
      console.error("获取选中块失败:", e);
    }

    return blocks;
  }

  /**
   * 获取插入目标块ID（最后一个选中的块）
   */
  private getInsertTargetBlockId(blocks: BlockInfo[]): string {
    if (blocks.length === 0) {
      return this.protyle.block.id || "";
    }
    return blocks[blocks.length - 1].id;
  }

  /**
   * 将块转换为kramdown格式
   */
  private async blocksToKramdown(blocks: BlockInfo[]): Promise<string> {
    return blocks.map((b) => b.kramdown).join("\n\n");
  }

  /**
   * 获取单个块的kramdown
   */
  private async getKramdown(blockId: string): Promise<string> {
    try {
      const result = await SY块.获取块Kramdown源码(blockId);
      return result.data.kramdown || "";
    } catch (e) {
      console.error(`获取块${blockId}的kramdown失败:`, e);
      return "";
    }
  }

  /**
   * 查找最近的块元素
   */
  private findClosestBlock(node: Node): HTMLElement | null {
    let current: Node | null = node;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const el = current as HTMLElement;
        if (el.getAttribute("data-node-id")) {
          return el;
        }
      }
      current = current.parentNode;
    }
    return null;
  }
}
