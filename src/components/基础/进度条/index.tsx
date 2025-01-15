export interface IProcessLineProps {
  process: number;
}

function ProcessLine(props: IProcessLineProps) {
  const { process } = props;
  return (
    <div style={{ width: "100%", height: "12px", display: "flex" }}>
      <div
        style={{
          width: `${process * 100}%`,
          background: "linear-gradient(to right, #ff8486, #9bc188)",
          borderRadius: "5px",
        }}
      ></div>
      <span
        style={{
          lineHeight: "12px",
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          color: "#fff",
          zIndex: 1,
        }}
      >
        {(process * 100).toFixed(2)}%
      </span>
    </div>
  );
}
export default ProcessLine;
