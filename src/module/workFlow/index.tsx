import { EStoreKey } from "@/constant/系统码";
import { storeAtom } from "@/store";
import "@xyflow/react/dist/style.css";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export interface IWorkFlowProps {}

function WorkFlow(props: IWorkFlowProps) {
  const {} = props;

  const [{ load, save }] = useAtom(storeAtom);
  const [data, setData] = useState<any>(null);

  const getData = useCallback(async () => {
    const data = await load(EStoreKey.WorkFlow);
    setData(data);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      {data?.map((item: any) => (
        <div key={item.id}>{item}</div>
      ))}
    </div>
  );
}
export default WorkFlow;
