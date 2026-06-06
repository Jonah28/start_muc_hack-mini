"use client";

import React, { useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { HEY_TELO_PHONE_NUMBER } from "@/lib/config";
import type { SiteConfig } from "@/lib/types";

const AuroraBackground = () => {
  const { scene } = useThree();

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          float flow1 = snoise(vec2(uv.x * 2.0 + time * 0.1, uv.y * 0.5 + time * 0.05));
          float flow2 = snoise(vec2(uv.x * 1.5 + time * 0.08, uv.y * 0.8 + time * 0.03));
          float flow3 = snoise(vec2(uv.x * 3.0 + time * 0.12, uv.y * 0.3 + time * 0.07));
          float streaks = sin((uv.x + flow1 * 0.3) * 8.0 + time * 0.2) * 0.5 + 0.5;
          streaks *= sin((uv.y + flow2 * 0.2) * 12.0 + time * 0.15) * 0.5 + 0.5;
          float aurora = (flow1 + flow2 + flow3) * 0.33 + 0.5;
          aurora = pow(aurora, 2.0);

          vec3 darkTeal = vec3(0.0, 0.1, 0.15);
          vec3 teal = vec3(0.0, 0.3, 0.4);
          vec3 cyan = vec3(0.0, 0.6, 0.7);
          vec3 brightCyan = vec3(0.2, 0.8, 0.9);
          vec3 green = vec3(0.0, 0.7, 0.4);

          vec3 color = darkTeal;
          float tealFlow = smoothstep(0.3, 0.7, aurora + streaks * 0.3);
          color = mix(color, teal, tealFlow);
          float cyanFlow = smoothstep(0.6, 0.9, aurora + flow1 * 0.4);
          color = mix(color, cyan, cyanFlow);
          float brightFlow = smoothstep(0.8, 1.0, streaks + aurora * 0.5);
          color = mix(color, brightCyan, brightFlow * 0.7);
          float greenFlow = smoothstep(0.7, 0.95, flow3 + streaks * 0.2);
          color = mix(color, green, greenFlow * 0.5);
          float noise = snoise(uv * 100.0) * 0.02;
          color += noise;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -50;
    scene.add(mesh);

    let animationFrameId: number;
    const animate = () => {
      material.uniforms.time.value += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  return null;
};

const CameraController = () => {
  const { camera } = useThree();
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.05) * 3;
    camera.position.y = Math.cos(time * 0.07) * 2;
    camera.position.z = 30;
    camera.lookAt(0, 0, -30);
  });
  return null;
};

export const AuroraFlow = ({ site }: { site: SiteConfig }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#001a26] font-sans">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          <AuroraBackground />
          <CameraController />
          <ambientLight intensity={0.9} />
          <pointLight position={[20, 20, 10]} intensity={0.8} color="#00cccc" distance={100} decay={2} />
          <pointLight position={[-20, -10, 5]} intensity={0.6} color="#00ff99" distance={80} decay={2} />
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-white">
          <p className="text-xl text-cyan-300 font-bold tracking-widest mb-4 uppercase">
            {site.profile.trade} · {site.profile.serviceArea}
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
            {site.profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-cyan-50/80 mb-10 max-w-2xl leading-relaxed">
            {site.profile.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`tel:${HEY_TELO_PHONE_NUMBER}`} className="px-8 py-4 rounded-full bg-cyan-500 text-slate-900 font-black text-lg hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              ☎ {HEY_TELO_PHONE_NUMBER}
            </a>
            <a href="#kontakt" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all">
              Kostenlose Anfrage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
