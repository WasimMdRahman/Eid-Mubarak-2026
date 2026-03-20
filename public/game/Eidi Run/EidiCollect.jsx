// EidiCollect.jsx (MODIFIED: Trees + Spherical Coins + Multi-color Runner)
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function EidiCollect() {
  const mountRef = useRef();
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(0);

  const getLevel = (s) => {
    if (s < 200) return { name: "Easy", speed: 0.5 };
    if (s < 400) return { name: "Medium", speed: 0.7 };
    if (s < 600) return { name: "Hard", speed: 0.9 };
    if (s < 800) return { name: "Survival", speed: 1.1 };
    return { name: "YOU CANNOT SURVIVE", speed: 1.3 };
  };

  const level = getLevel(score);

  useEffect(() => {
    let animationId;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f4a460"); // Sandy Brown
    scene.fog = new THREE.Fog("#f4a460", 20, 100); // Add desert fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);
    }

    // LIGHT
    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(5, 10, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // PLAYER Setup
    const player = new THREE.Group();
    
    // Materials
    const matHead = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Skin Tone
    const matUpper = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Black Upper Body
    const matLower = new THREE.MeshStandardMaterial({ color: 0x3b82f6 }); // Blue Lower Body

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matHead);
    head.position.y = 3.2;
    
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.6), matUpper);
    body.position.y = 2.1;

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 0.35), matHead);
    armL.position.set(-0.8, 2.2, 0);
    const armR = armL.clone(); 
    armR.position.x = 0.8;

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.4, 0.45), matLower);
    legL.position.set(-0.35, 0.7, 0);
    const legR = legL.clone(); 
    legR.position.x = 0.35;

    player.add(head, body, armL, armR, legL, legR);
    scene.add(player);

    const anims = [
      gsap.to(legL.rotation, { x: 0.6, repeat: -1, yoyo: true, duration: 0.2 }),
      gsap.to(legR.rotation, { x: -0.6, repeat: -1, yoyo: true, duration: 0.2 }),
      gsap.to(armL.rotation, { x: -0.6, repeat: -1, yoyo: true, duration: 0.2 }),
      gsap.to(armR.rotation, { x: 0.6, repeat: -1, yoyo: true, duration: 0.2 })
    ];

    // CONTROLS
    let isJumping = false;
    const lanes = [-2.5, 0, 2.5];
    let lane = 1;

    const moveLane = (dir) => {
      lane = Math.max(0, Math.min(2, lane + dir));
      gsap.to(player.position, { x: lanes[lane], duration: 0.2 });
    };

    const jump = () => {
      if (isJumping) return;
      isJumping = true;
      gsap.to(player.position, {
        y: 3.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.out",
        onComplete: () => { player.position.y = 0; isJumping = false; }
      });
    };

    const keyHandler = (e) => {
      if (gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "a" || e.key === "ArrowLeft") moveLane(-1);
      if (e.key === "d" || e.key === "ArrowRight") moveLane(1);
      if (e.key === " " || e.key === "ArrowUp") jump();
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const touchStartHandler = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const touchEndHandler = (e) => {
      if (gameOver) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) moveLane(1);
          else moveLane(-1);
        } else {
          if (dy < 0) jump();
        }
      }
    };

    const touchMoveHandler = (e) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", keyHandler);
    window.addEventListener("touchstart", touchStartHandler, { passive: false });
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler, { passive: false });

    // GROUND (Desert Vibe)
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe3b04b }); // Golden Sand
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 }); // Slightly Darker Gold
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xc68e17 }); // Deep Gold sides

    // Wide desert floor
    const desertFloor = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), groundMat);
    desertFloor.rotation.x = -Math.PI / 2;
    desertFloor.position.y = -0.1; // Slightly below road
    scene.add(desertFloor);

    const road = new THREE.Group();
    const floor1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 200), roadMat);
    floor1.rotation.x = -Math.PI / 2;
    floor1.position.z = -50;
    
    // Side curbs
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 200), curbMat);
    curbL.position.set(-4.5, 0.1, -50);
    const curbR = curbL.clone();
    curbR.position.x = 4.5;

    road.add(floor1, curbL, curbR);
    scene.add(road);
    // BACKGROUND/SIDE OBJECTS
    const sideObjects = [];
    const objects = [];

    const createCactus = (x) => {
      const cactus = new THREE.Group();
      
      const mat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 }); // Dark Cactus Green
      
      // Main trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 2, 8), mat);
      trunk.position.y = 1;
      
      // Arms
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8), mat);
      arm1.position.set(0.4, 1.2, 0);
      arm1.rotation.z = Math.PI / 4;
      
      const arm2 = arm1.clone();
      arm2.position.set(-0.4, 1.5, 0);
      arm2.rotation.z = -Math.PI / 4;

      cactus.add(trunk, arm1, arm2);
      cactus.position.set(x, 0, -150);
      return cactus;
    };

    const spawn = () => {
      // 1. Spawn Cacti on sides
      if (Math.random() > 0.4) {
        const cactusL = createCactus(-7 - Math.random() * 3);
        const cactusR = createCactus(7 + Math.random() * 3);
        scene.add(cactusL, cactusR);
        sideObjects.push(cactusL, cactusR);
      }

      // 2. Spawn Gameplay Objects (Coins/Obstacles)
      const isCoin = Math.random() > 0.4;
      let mesh;

      if (isCoin) {
        // ✅ CHANGE: Sphere-like gems/coins
        mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.45, 1),
          new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1, emissive: 0xffaa00, emissiveIntensity: 0.2 })
        );
        mesh.position.y = 1.5;
        
        // Spin and float
        gsap.to(mesh.rotation, { y: Math.PI * 2, repeat: -1, duration: 1.5, ease: "none" });
        gsap.to(mesh.position, { y: "+=0.4", yoyo: true, repeat: -1, duration: 0.8, ease: "power1.inOut" });

      } else {
        // Obstacles (Barrels or Crates)
        mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x7f1d1d })
        );
        mesh.position.y = 0.6;
      }

      mesh.position.x = lanes[Math.floor(Math.random() * 3)];
      mesh.position.z = -150;
      mesh.userData.type = isCoin ? "coin" : "obstacle";

      scene.add(mesh);
      objects.push(mesh);
    };

    const interval = setInterval(spawn, 600); // Faster spawning

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const speed = getLevel(scoreRef.current).speed;

      // Move side trees
      sideObjects.forEach((obj, i) => {
        obj.position.z += speed;
        if (obj.position.z > 20) {
          scene.remove(obj);
          sideObjects.splice(i, 1);
        }
      });

      // Move gameplay objects
      objects.forEach((obj, i) => {
        obj.position.z += speed;

        const dx = obj.position.x - player.position.x;
        const dz = obj.position.z - player.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Better collision detection including vertical for jumping
        const dy = Math.abs(obj.position.y - player.position.y);
        
        if (dist < 1.2 && (obj.userData.type === "coin" || dy < 1.5)) {
          if (obj.userData.type === "coin") {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            gsap.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.2, onComplete: () => scene.remove(obj) });
            objects.splice(i, 1);
          } else {
            // End Game
            cancelAnimationFrame(animationId);
            clearInterval(interval);
            window.removeEventListener("keydown", keyHandler);
            anims.forEach(a => a.kill());
            setGameOver(true);
          }
        }

        if (obj.position.z > 10) {
          scene.remove(obj);
          objects.splice(i, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("resize", handleResize);
      anims.forEach(a => a.kill());
    };

  }, [gameId]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <div ref={mountRef} />

      <div style={{
        position: 'absolute', top: 30, left: 30, color: 'white', 
        fontFamily: 'Outfit, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>🌙 Coins: {score}</div>
        <div style={{ fontSize: '20px', opacity: 0.8 }}>Level: {level.name}</div>
      </div>

      {gameOver && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', 
          textAlign: 'center', background: 'rgba(255,255,255,0.9)', padding: '40px', 
          borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', fontFamily: 'Outfit, sans-serif'
        }}>
          <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '48px' }}>Game Over</h1>
          <p style={{ fontSize: '24px', color: '#666' }}>Final Score: {score}</p>
          <button 
            onClick={() => { scoreRef.current = 0; setScore(0); setGameOver(false); setGameId(id => id + 1); }}
            style={{
              marginTop: '20px', padding: '12px 40px', fontSize: '18px', 
              background: '#3b82f6', color: 'white', border: 'none', 
              borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
