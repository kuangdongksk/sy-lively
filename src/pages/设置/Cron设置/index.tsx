import { List } from "antd";

function Cron设置() {
  return (
    <>
      <List
        dataSource={[]}
        renderItem={(item) => {
          return <List.Item>{item}</List.Item>;
        }}
      />
    </>
  );
}
export default Cron设置;
