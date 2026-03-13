"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Windmill({ style }: { style?: React.CSSProperties }) {
  const rotorRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = rotorRef.current;
    if (!el) return;

    const anim = gsap.to(el, {
      rotation: 1440,
      svgOrigin: "200 200",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
    };
  }, []);

  const blade = "M -33 -5 L -35 -136 Q -22 -160 0 -160 Q 22 -160 35 -136 L 33 -5 Z";

  return (
    <svg
      viewBox="0 0 400 600"
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="wm-tower" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#cbb891" />
          <stop offset="48%" stopColor="#ede0c4" />
          <stop offset="100%" stopColor="#c2a475" />
        </linearGradient>
        <linearGradient id="wm-blade-a" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#d4883a" />
          <stop offset="55%" stopColor="#a05818" />
          <stop offset="100%" stopColor="#7a3c0c" />
        </linearGradient>
        <linearGradient id="wm-blade-b" x1="1" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#c07830" />
          <stop offset="100%" stopColor="#8a4812" />
        </linearGradient>
        <linearGradient id="wm-base" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#a06028" />
          <stop offset="100%" stopColor="#7a4010" />
        </linearGradient>
        <linearGradient id="wm-hub" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#b0b7c0" />
          <stop offset="100%" stopColor="#7a8491" />
        </linearGradient>
      </defs>

      {/* ── TOWER BODY ── */}
      <path d="M 96 200 L 124 578 L 276 578 L 304 200 Z" fill="url(#wm-tower)" stroke="#7a5828" strokeWidth="2.5" />
      {/* Shadow side */}
      <path d="M 242 200 L 260 578 L 276 578 L 304 200 Z" fill="rgba(0,0,0,0.1)" />
      {/* Inner highlight */}
      <path d="M 120 200 L 130 578 L 148 578 L 136 200 Z" fill="rgba(255,255,255,0.07)" />

      {/* ── BASE ── */}
      <rect x="114" y="573" width="172" height="34" rx="6" fill="url(#wm-base)" stroke="#5a2e08" strokeWidth="2" />

      {/* ── DOOR ── */}
      <path d="M 188 607 L 188 588 Q 200 577 212 588 L 212 607 Z" fill="#3d1e06" />
      <circle cx="208" cy="598" r="2.5" fill="#8a6030" />

      {/* ── WINDOW 1 ── */}
      <path d="M 189 336 Q 200 325 211 336 L 211 360 L 189 360 Z" fill="#3d1e06" stroke="#5a3010" strokeWidth="1" />

      {/* ── WINDOW 2 ── */}
      <path d="M 187 428 Q 200 416 213 428 L 213 452 L 187 452 Z" fill="#3d1e06" stroke="#5a3010" strokeWidth="1" />

      {/* ── NACELLE ── */}
      <rect x="172" y="178" width="56" height="46" rx="10" fill="#4a2808" stroke="#3a1806" strokeWidth="2" />
      <rect x="176" y="182" width="48" height="38" rx="8" fill="#6a3c18" />
      <rect x="178" y="184" width="20" height="34" rx="6" fill="rgba(255,255,255,0.05)" />

      {/* ── ROTOR ── */}
      <g ref={rotorRef}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={deg} transform={`translate(200,200) rotate(${deg})`}>
            <path d={blade} fill={i % 2 === 0 ? "url(#wm-blade-a)" : "url(#wm-blade-b)"} stroke="#3d1800" strokeWidth="1.5" />
            <line x1="-33" y1="-55"  x2="33" y2="-55"  stroke="#3d1800" strokeWidth="0.9" opacity="0.55" />
            <line x1="-34" y1="-108" x2="34" y2="-108" stroke="#3d1800" strokeWidth="0.9" opacity="0.55" />
            <line x1="-11" y1="-6"   x2="-11" y2="-158" stroke="#3d1800" strokeWidth="0.9" opacity="0.55" />
            <line x1="11"  y1="-6"   x2="11"  y2="-158" stroke="#3d1800" strokeWidth="0.9" opacity="0.55" />
          </g>
        ))}
        <circle cx="200" cy="200" r="26" fill="#3d1e06" stroke="#2a1004" strokeWidth="2" />
        <circle cx="200" cy="200" r="18" fill="url(#wm-hub)" stroke="#6b7280" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="8"  fill="#6b7280" />
        <circle cx="200" cy="200" r="4"  fill="#374151" />
      </g>
    </svg>
  );
}
