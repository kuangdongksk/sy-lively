import { ExtensionCategory, Graph as G6Graph, register } from "@antv/g6";
import { ReactNode } from "@antv/g6-extension-react";
import { useEffect, useRef } from "react";

const ICON_MAP = {
  error: "&#10060;",
  overload: "&#9889;",
  running: "&#9989;",
};

const COLOR_MAP = {
  error: "#f5222d",
  overload: "#faad14",
  running: "#52c41a",
};
export interface I关系图Props {
  options?: any;
  onRender?: (graph: G6Graph) => void;
  onDestroy?: () => void;
}

register(ExtensionCategory.NODE, "react", ReactNode);

function 关系图(props: I关系图Props) {
  const {} = props;
  const { options, onRender, onDestroy } = props;
  const 图Ref = useRef<G6Graph>();
  const 容器Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const 图 = new G6Graph({
      container: 容器Ref.current!,
      data: {
        nodes: [
          {
            id: "node-1",
            data: { location: "East", status: "error", ip: "192.168.1.2" },
          },
          {
            id: "node-2",
            data: { location: "West", status: "overload", ip: "192.168.1.3" },
          },
          {
            id: "node-3",
            data: { location: "South", status: "running", ip: "192.168.1.4" },
          },
        ],
      },
      node: {
        type: "html",
        style: {
          size: [240, 80],
          dx: -120,
          dy: -40,
          innerHTML: (d) => {
            const {
              data: { location, status, ip },
            } = d;
            const color = COLOR_MAP[status];

            return `
  <div 
    style="
      width:100%; 
      height: 100%; 
      background: ${color}bb; 
      border: 1px solid ${color};
      color: #fff;
      user-select: none;
      display: flex; 
      padding: 10px;
      "
  >
    <div style="display: flex;flex-direction: column;flex: 1;">
      <div style="font-weight: bold;">
        ${location} Node
      </div>
      <div>
        status: ${status} ${ICON_MAP[status]}
      </div>
    </div>
    <div>
      <span style="border: 1px solid white; padding: 2px;">
        ${ip}
      </span>
    </div>
  </div>`;
          },
        },
      },
      layout: {
        type: "grid",
      },
      behaviors: ["drag-element", "zoom-canvas"],
    });
    图Ref.current = 图;

    return () => {
      const 图 = 图Ref.current;
      if (图) {
        图.destroy();
        onDestroy?.();
        图Ref.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    const 容器 = 容器Ref.current;
    const 图 = 图Ref.current;

    if (!options || !容器 || !图 || 图.destroyed) return;

    图.setOptions(options);
    图.render()
      .then(() => onRender?.(图))
      .catch((error) => console.debug(error));
  }, [options]);

  return (
    <div
      ref={容器Ref}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
export default 关系图;
