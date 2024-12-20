import $, { Cash } from "cash-dom";

export type TVeilTargetType = "目录" | "页签" | "内容区" | "块";
export const veilZIndex = 5;
export const blur = "blur(5px)";

export default class VeilElement {
  private veil = document.createElement("div");
  private $veil = $(this.veil);

  constructor($parent: Cash, id: string, targetType: TVeilTargetType) {
    $parent.css("position", "relative");

    this.$veil.css({
      backdropFilter: blur,
      filter: blur,
      zIndex: "1",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      cursor: "not-allowed",
    } as any);
    this.$veil.data("veilId", id);
    this.$veil.data("veilType", targetType);

    $parent.append(this.$veil);

    this.$veil.on("click", () => {
      this.$veil.remove();
    });
  }
}
