import { useLocation, useNavigate } from "react-router-dom";

function RoutePath() {
  const location = useLocation();
  const 导航到 = useNavigate();

  const 路径 = decodeURI(location.pathname).split("/");

  return (
    <span>
      {路径.map((item, index) => {
        if (item === "") {
          return null;
        }

        if (index === 路径.length - 1) {
          return <span key={item}>/{item}</span>;
        }
        return (
          <a
            key={item}
            onClick={() => {
              导航到(路径.slice(0, index + 1).join("/"));
            }}
          >
            /{item}
          </a>
        );
      })}
    </span>
  );
}
export default RoutePath;
