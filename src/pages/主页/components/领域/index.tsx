import { Card, List } from "antd";
import { useState } from "react";

function 领域() {
  const [领域列表, 令领域列表为] = useState([
    {
      title: "添加领域",
    },
  ]);

  return (
    <List
      dataSource={领域列表}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      pagination={{
        position: "bottom",
        align: "end",
      }}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title}>Card content</Card>
        </List.Item>
      )}
    />
  );
}

export default 领域;
