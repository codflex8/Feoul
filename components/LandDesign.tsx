import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { Object3D } from "three";

type ModelProps = {
  path: string;
  position: [number, number, number];
};

const Model: React.FC<ModelProps> = ({ path, position }) => {
  const gltf = useLoader(GLTFLoader, path);

  return <primitive object={gltf.scene as Object3D} position={position} />;
};

const ThreeScene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 75 }}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Models */}
      <Model path="./bmw.glb" position={[-4, 0, 0]} />
      <Model path="./dolphin.glb" position={[0, 0, 0]} />
      <Model path="./bmw.glb" position={[0, 0, 4]} />

      {/* Camera Controls */}
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeScene;
