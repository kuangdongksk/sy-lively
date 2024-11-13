// id	内容块 ID	20210104091228-d0rzbmm
// parent_id	上级块的 ID，文档块该字段为空	20200825162036-4dx365o
// root_id	顶层块的 ID，即文档块 ID	20200825162036-4dx365o
// hash	content 字段的 SHA256 校验和	a75d25c
// box	笔记本 ID	20210808180117-czj9bvb
// path	内容块所在文档路径	/20200812220555-lj3enxa/20210808180320-abz7w6k/20200825162036-4dx365o.sy
// hpath	人类可读的内容块所在文档路径	/0 请从这里开始/编辑器/排版元素
// name	内容块名称	一级标题命名
// alias	内容块别名	一级标题别名
// memo	内容块备注	一级标题备注
// tag	非文档块为块内包含的标签，文档块为文档的标签	#标签1# #标签2# #标签3#
// content	去除了 Markdown 标记符的文本	一级标题
// fcontent	第一个子块去除了 Markdown 标记符的文本(1.9.9 添加)	第一个子块
// markdown	包含完整 Markdown 标记符的文本	# 一级标题
// length	fcontent 字段文本长度	6
// type	内容块主类型，参考 blocks.type	h
// subtype	内容块次类型，参考 blocks.subtype	h1
// ial	内联属性列表，形如 {: name="value"}	{: id="20210104091228-d0rzbmm" updated="20210604222535"}
// sort	排序权重，数值越小排序越靠前	5
// created	创建时间	20210104091228
// updated	更新时间	20210604222535
export interface I块 {
  id: string;
  parent_id: string;
  root_id: string;
  hash: string;
  box: string;
  path: string;
  hpath: string;
  name: string;
  alias: string;
  memo: string;
  tag: string;
  content: string;
  fcontent: string;
  markdown: string;
  length: number;
  type: string;
  subtype: string;
  ial: string;
  sort: number;
  created: string;
  updated: string;
}

// type	类型	b
// block_id	块 ID	20210428212840-859h45j
// root_id	文档 ID	20200812220555-lj3enxa
// box	笔记本 ID	20210808180117-czj9bvb
// path	文档文件路径	/20200812220555-lj3enxa.sy
export interface I块属性 {
  id: string;
  name: string;
  value: string;
  type: string;
  block_id: string;
  root_id: string;
  box: string;
}
