import { MD5 } from "@/constant/三方库";
import axios from "axios";
import dayjs from "dayjs";
import { AiFaDianTOKEN } from "../../../../env";

const USER_ID = "7a6357e07c9a11efb42f52540025c377";
const BASE_URL = "https://afdian.com/api/open/";

export enum AiFaDianPath {
  // 查询订单
  queryOrder = "query-order",
  // 查询赞助者
  querySponsor = "query-sponsor",
}

export async function queryAiFaDian(path: AiFaDianPath, params: Object) {
  const user_id = USER_ID;
  const ts = dayjs().unix();
  const paramsStr = JSON.stringify(params);

  const result = await axios({
    method: "post",
    url: BASE_URL + path,
    data: {
      user_id,
      params: paramsStr,
      ts: dayjs().unix(),
      sign: MD5.hex(
        AiFaDianTOKEN + "params" + paramsStr + "ts" + ts + "user_id" + user_id
      ),
    },
  });
  return result.data;
}
