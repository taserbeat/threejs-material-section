import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./App.css";

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 2);

// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const octahedronGeometry = new THREE.OctahedronGeometry(0.5);

/**
 * マテリアルセクション
 */
const material = new THREE.MeshBasicMaterial();

// メッシュ化
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
sphereMesh.position.x = -1.5;

const planeMesh = new THREE.Mesh(planeGeometry, material);

const octahedronMesh = new THREE.Mesh(octahedronGeometry, material);
octahedronMesh.position.x = 1.5;

scene.add(sphereMesh, planeMesh, octahedronMesh);

// マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// クロック
const clock = new THREE.Clock();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function App() {
  const refDiv = useRef<HTMLDivElement>(null);

  const handleOnBrowserResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    return;
  };

  useEffect(() => {
    window.addEventListener("resize", handleOnBrowserResize);

    refDiv.current?.appendChild(renderer.domElement);

    const updateRender = () => {
      const elapsedTime = clock.getElapsedTime();

      // オブジェクトを回転させる
      sphereMesh.rotation.x = elapsedTime;
      sphereMesh.rotation.y = elapsedTime;

      planeMesh.rotation.x = elapsedTime;
      planeMesh.rotation.y = elapsedTime;

      octahedronMesh.rotation.x = elapsedTime;
      octahedronMesh.rotation.y = elapsedTime;

      controls.update();

      // レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(updateRender);
    };

    updateRender();

    return () => {
      refDiv.current?.removeChild(renderer.domElement);
      removeEventListener("resize", handleOnBrowserResize);
    };
  }, []);

  return (
    <div className="App">
      <div className="scene" ref={refDiv}></div>
    </div>
  );
}

export default App;
