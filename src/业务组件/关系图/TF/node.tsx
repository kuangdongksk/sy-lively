import { 思源协议 } from "@/constant/系统码";
import { DragControls, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useCallback, useRef, useState } from "react";
import { Mesh } from "three";

export const Node = memo(
  (props: {
    position: [number, number, number];
    title: string;
    id: string;
  }) => {
    const { position, title, id } = props;
    const meshRef = useRef<Mesh>(null);
    const [hovered, setHover] = useState(false);

    const handlePointerOver = useCallback(() => setHover(true), []);
    const handlePointerOut = useCallback(() => setHover(false), []);

    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.1;
      }
    });

    return (
      <DragControls>
        <mesh
          ref={meshRef}
          position={position}
          scale={hovered ? 1.2 : 1}
          onPointerDown={() => console.log("click")}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
          <Html
            position={[0, 0, 0.06]}
            center
            style={{
              color: "black",
              background: "rgba(255,255,255,0.8)",
              padding: "5px 10px",
              borderRadius: "5px",
              userSelect: "none",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            <a data-type="block-ref" data-id={id} href={思源协议 + id}>
              {title}
            </a>
          </Html>
        </mesh>
      </DragControls>
    );
  }
);
