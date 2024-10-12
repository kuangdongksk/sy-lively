import { E数据索引 } from "@/constant/系统码";
import 领域 from "./components/领域";

export interface I主页Props {
  加载数据: (key: E数据索引) => Promise<any>;
  保存数据: (key: E数据索引, value: any) => Promise<void>;
}

function Home() {
  return <领域 />;
}

export default Home;
