export interface IOnLoadProps {}

function OnLoad(props: IOnLoadProps) {
  const {} = props;
  return (
    <>
      <div>OnLoad</div>
    </>
  );
}
export default OnLoad;

export enum EPluginLifeCycle {
  onLoad = "PluginLifeCycle_onLoad",
}

export const PluginLifeCycle = {
  OnLoad,
};
