import { E数据索引 } from "@/constant/系统码";
import 任务树 from "@/pages/主页/components/任务树";

export interface I主页Props {
  加载数据: (key: E数据索引) => Promise<any>;
  保存数据: (key: E数据索引, value: any) => Promise<void>;
}

function Home(props: I主页Props) {
  const { 加载数据, 保存数据 } = props;

  return (
    <div>
      <任务树 加载数据={加载数据} 保存数据={保存数据} />
    </div>
  );
}

export default Home;
