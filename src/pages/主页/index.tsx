import { E数据索引 } from "@/constant/系统码";
import 事项树 from "@/pages/主页/components/事项树";

export interface I主页Props {
  加载数据: (key: E数据索引) => Promise<any>;
  保存数据: (key: E数据索引, value: any) => Promise<void>;
}

function Home() {
  return <事项树 />;
}

export default Home;
