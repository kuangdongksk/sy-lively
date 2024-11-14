export const 最新版本号 = "P0.1.4-2";

export const 所有更新公告: {
  key: string;
  Children: {
    type: string;
    content: React.ReactNode[];
  }[];
}[] = [
  {
    key: 最新版本号,
    Children: [
      {
        type: "修复",
        content: ["修复卡片无法添加别名问题"],
      },
      {
        type: "移除",
        content: ["移除更换主题功能"],
      },
    ],
  },
  {
    key: "P0.1.4",
    Children: [
      {
        type: "功能",
        content: [
          <>
            添加快捷键alt+q，快速新建卡片，需要在喧嚣设置内生成卡片文档,并且需要在思源的设置--搜索中打开超级块和别名
            <img src="https://b3logfile.com/file/2024/11/image-Ut4o21e.png?imageView2/2/interlace/1/format/webp" />
          </>,
          "添加快捷键shift+alt+x，快速打开喧嚣面板",
        ],
      },
    ],
  },
];
