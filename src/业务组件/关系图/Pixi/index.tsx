import { I卡片 } from "@/class/卡片";
import { Container, Graphics, Stage } from "@pixi/react";
import { Point } from "pixi.js";
import React, { useMemo, useRef, useState } from "react";

interface INodeCanvasProps {
  nodes: I卡片[];
}

const NodeCanvas: React.FC<INodeCanvasProps> = (props: INodeCanvasProps) => {
  const { nodes } = props;

  const containerRefs = useRef({});
  const lineContainerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeMap = useMemo(
    () => new Map(nodes.map((node) => [node.ID, node])),
    [nodes]
  );

  const handleDragStart = (e, node) => {
    const container = e.currentTarget;
    container.dragging = true;
    container.startPosition = { x: container.x, y: container.y };
  };

  const handleDragMove = (e, node) => {
    const container = e.currentTarget;
    if (container.dragging) {
      container.x =
        container.startPosition.x + e.data.global.x - e.data.start.global.x;
      container.y =
        container.startPosition.y + e.data.global.y - e.data.start.global.y;
    }
  };

  const handleDragEnd = (e, node) => {
    const container = e.currentTarget;
    container.dragging = false;
    if (node.singleOpenPage) {
      adaptContainerSize(container);
    }
  };

  const adaptContainerSize = (container) => {
    const children = container.children;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    children.forEach((child) => {
      const pos = child.toLocal(child.position, container);
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x);
      maxY = Math.max(maxY, pos.y);
    });
    container.width = maxX - minX;
    container.height = maxY - minY;
    container.x += minX;
    container.y += minY;
  };

  const renderNode = (node: I卡片) => {
    const isPage = node.单开一页 || false;

    return isPage ? (
      <Graphics
        draw={(graphics) => {
          graphics.beginFill(0xff0000);
          graphics.drawCircle(node.X, node.Y, 50);
          graphics.endFill();
        }}
      />
    ) : (
      <Graphics
        draw={(graphics) => {
          graphics.beginFill(0x0000ff);
          graphics.drawCircle(node.X, node.Y, 10);
          graphics.endFill();
        }}
      />
    );
  };

  const handleNodeClick = (e, node) => {
    if (e.ctrlKey) {
      if (!selectedNode) {
        setSelectedNode(node.ID);
      } else if (selectedNode !== node.ID) {
        const node1 = nodeMap.get(selectedNode);
        const node1Container = containerRefs.current[selectedNode];
        const node2 = node;
        const node2Container = containerRefs.current[node.ID];
        createConnection(node1Container, node2Container);
        setSelectedNode(null);
      }
    }
  };

  const createConnection = (node1Container, node2Container) => {
    const pos1 = node1Container.toGlobal(
      new Point(node1Container.width / 2, node1Container.height / 2)
    );
    const pos2 = node2Container.toGlobal(
      new Point(node2Container.width / 2, node2Container.height / 2)
    );
    // const graphics = <Graphics />;
    // graphics.lineStyle(2, 0xffffff);
    // graphics.moveTo(pos1.x, pos1.y);
    // graphics.lineTo(pos2.x, pos2.y);
    // lineContainerRef.current.addChild(graphics);
  };

  return (
    <Stage width={800} height={600} options={{ background: 0x1099bb }}>
      {nodes.map((node) => (
        <Container
          key={node.ID}
          ref={(el) => (containerRefs.current[node.ID] = el)}
          interactive
          onpointerdown={(e) => handleDragStart(e, node)}
          onpointermove={(e) => handleDragMove(e, node)}
          onpointerup={(e) => handleDragEnd(e, node)}
          onclick={(e) => handleNodeClick(e, node)}
        >
          {renderNode(node)}
        </Container>
      ))}
      <Container ref={lineContainerRef} />
    </Stage>
  );
};

export default NodeCanvas;
