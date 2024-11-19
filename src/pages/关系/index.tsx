import 关系图 from "@/业务组件/关系图";
import styles from "./index.module.css";

export interface I关系Props {}

function 关系(props: I关系Props) {
  const {} = props;

  return (
    <div className={styles.撑满}>
      <关系图 />
    </div>
  );
}
export default 关系;
