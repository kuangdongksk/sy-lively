import { i18n } from "@/constant/i18n";
import { I18nPath } from "@/constant/i18n/zh";

export interface ICalendarNodeProps {}

function CalendarNode(props: ICalendarNodeProps) {
  const {} = props;
  return (
    <>
      <div>{i18n.t(I18nPath.workFlow.components.CalendarNode.this)}</div>
    </>
  );
}
export default CalendarNode;
