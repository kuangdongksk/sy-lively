import { 获取笔记本下的对应日期的日记文档 } from "@/API/文档/获取";
import { 思源协议 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { JavaOutlined } from "@ant-design/icons";
import { Button, Calendar, Tooltip } from "antd";
import { useAtom } from "jotai";

function 日历() {
  const [用户设置] = useAtom(用户设置Atom);
  return (
    <Calendar
      cellRender={(value, info) => {
        return (
          <div>
            <Tooltip title="跳转到日记">
              <Button
                type="link"
                icon={<JavaOutlined />}
                onClick={() => {
                  获取笔记本下的对应日期的日记文档(
                    用户设置.笔记本ID,
                    value
                  ).then(({ id }) => {
                    window.open(思源协议 + id);
                  });
                }}
              />
            </Tooltip>
          </div>
        );
      }}
    />
  );
}

export default 日历;
