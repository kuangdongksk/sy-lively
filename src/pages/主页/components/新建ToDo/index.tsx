import { Button, Form, Input, Select } from "antd";
import { nanoid } from "nanoid";
import { useState } from "react";

function 新建ToDo() {
  const [任务ID, set任务ID] = useState<string>(nanoid());

  return (
    <Form>
      <Form.Item label="任务ID">
        <Input value={`#${任务ID.substring(0, 6)}`} disabled />
      </Form.Item>
      <Form.Item label="任务名称">
        <Input />
      </Form.Item>
      <Form.Item label="任务描述">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="紧急程度">
        <Select />
      </Form.Item>
      <Form.Item label="截止日期">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          新建
        </Button>
      </Form.Item>
    </Form>
  );
}

export default 新建ToDo;
