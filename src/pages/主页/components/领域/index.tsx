import { Table } from "antd";
import { useLocation } from "react-router-dom";
import { I领域 } from "../..";
import { I事项 } from "../事项树/components/事项";
import { 分类列配置, 列配置 } from "./constant";

function 领域() {
  const { state } = useLocation() as {
    state: I领域;
  };

  return (
    <>
      <Table
        columns={分类列配置}
        dataSource={state.分类}
        expandable={{
          expandedRowRender: () => {
            return <Table<I事项> columns={列配置} dataSource={[]} />;
          },
        }}
      />
    </>
  );
}

export default 领域;
