
"use client"

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export function EidiCollect() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(0);

  const getLevel = (s: number) => {
    if (s < 200) return { name: "Easy", speed: 0.5 };
    if (s < 400) return { name: "Medium", speed: 0.7 };
    if (s < 600) return { name: "Hard", speed: 0.9 };
    if (s < 800) return { name: "Survival", speed: 1.1 };
    return { name: "UNSTOPPABLE", speed: 1.3 };
  };

  const level = getLevel(score);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let animationId: number;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f4a460"); 
    scene.fog = new THREE.Fog("#f4a460", 20, 100);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (mountRef.current) {
        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(renderer.domElement);
    }

    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(5, 10, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const player = new THREE.Group();
    const matHead = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const matUpper = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const matLower = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });

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

    let isJumping = false;
    const lanes = [-2.5, 0, 2.5];
    let lane = 1;

    const moveLane = (dir: number) => {
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

    const keyHandler = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "a" || e.key === "ArrowLeft") moveLane(-1);
      if (e.key === "d" || e.key === "ArrowRight") moveLane(1);
      if (e.key === " " || e.key === "ArrowUp") jump();
    };

    window.addEventListener("keydown", keyHandler);

    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe3b04b });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xc68e17 });

    const desertFloor = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), groundMat);
    desertFloor.rotation.x = -Math.PI / 2;
    desertFloor.position.y = -0.1;
    scene.add(desertFloor);

    const road = new THREE.Group();
    const floor1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 200), roadMat);
    floor1.rotation.x = -Math.PI / 2;
    floor1.position.z = -50;
    
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 200), curbMat);
    curbL.position.set(-4.5, 0.1, -50);
    const curbR = curbL.clone();
    curbR.position.x = 4.5;

    road.add(floor1, curbL, curbR);
    scene.add(road);

    const sideObjects: THREE.Group[] = [];
    const objects: THREE.Mesh[] = [];

    const createCactus = (x: number) => {
      const cactus = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 2, 8), mat);
      trunk.position.y = 1;
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
      if (Math.random() > 0.4) {
        const cactusL = createCactus(-7 - Math.random() * 3);
        const cactusR = createCactus(7 + Math.random() * 3);
        scene.add(cactusL, cactusR);
        sideObjects.push(cactusL, cactusR);
      }

      const isCoin = Math.random() > 0.4;
      let mesh: THREE.Mesh;

      if (isCoin) {
        mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.45, 1),
          new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1, emissive: 0xffaa00, emissiveIntensity: 0.2 })
        );
        mesh.position.y = 1.5;
        gsap.to(mesh.rotation, { y: Math.PI * 2, repeat: -1, duration: 1.5, ease: "none" });
        gsap.to(mesh.position, { y: "+=0.4", yoyo: true, repeat: -1, duration: 0.8, ease: "power1.inOut" });
      } else {
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

    const interval = setInterval(spawn, 600);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const speed = getLevel(scoreRef.current).speed;

      sideObjects.forEach((obj, i) => {
        obj.position.z += speed;
        if (obj.position.z > 20) {
          scene.remove(obj);
          sideObjects.splice(i, 1);
        }
      });

      objects.forEach((obj, i) => {
        obj.position.z += speed;

        const dx = obj.position.x - player.position.x;
        const dz = obj.position.z - player.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const dy = Math.abs(obj.position.y - player.position.y);
        
        if (dist < 1.2 && (obj.userData.type === "coin" || dy < 1.5)) {
          if (obj.userData.type === "coin") {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            gsap.to(obj.scale, { x: 0, y: 0, z: 0, duration: 0.2, onComplete: () => scene.remove(obj) });
            objects.splice(i, 1);
          } else {
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
      window.removeEventListener("resize", handleResize);
      anims.forEach(a => a.kill());
    };
  }, [gameId]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div ref={mountRef} className="w-full h-full" />

      {/* Score Overlay */}
      <div className="absolute top-8 right-8 text-white font-headline drop-shadow-lg pointer-events-none text-right">
        <div className="text-4xl font-bold flex items-center justify-end gap-3">
          <span className="text-accent">Eidi: {score}</span>
        </div>
        <div className="text-xl opacity-70 mt-1 uppercase tracking-widest font-serif italic">Level: {level.name}</div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-md">
          <div className="text-center bg-background border border-accent/20 p-12 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 max-w-md w-full mx-4">
            <h1 className="text-6xl font-headline text-accent mb-2">Game Over</h1>
            {/* Increased Final Eidi text size to 48px */}
            <p className="text-[48px] text-muted-foreground mb-12 font-serif italic leading-tight">Final Eidi Collected: {score}</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { scoreRef.current = 0; setScore(0); setGameOver(false); setGameId(id => id + 1); }}
                className="flex items-center justify-center gap-3 w-full py-5 bg-accent text-accent-foreground text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg active:scale-95"
              >
                <RefreshCcw className="w-6 h-6" />
                Play Again
              </button>
              
              <Link href="/">
                <button className="flex items-center justify-center gap-3 w-full py-5 bg-white/5 border border-white/10 text-white text-xl font-bold rounded-full hover:bg-white/10 transition-colors shadow-lg">
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
