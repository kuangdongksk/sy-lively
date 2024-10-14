import { Table } from "antd";
import { useLocation } from "react-router-dom";
import { 分类列配置, 列配置 } from "./constant";
import { I事项 } from "../事项树/components/事项";
import { I领域 } from "../..";

function 领域() {
  const { state } = useLocation() as {
    state: I领域;
  };

  return (
    <div>
      <Table
        columns={分类列配置}
        dataSource={state.分类}
        expandable={{
          expandedRowRender: () => {
            return <Table<I事项> columns={列配置} dataSource={[]} />;
          },
        }}
      />
    </div>
  );
}

export default 领域;
