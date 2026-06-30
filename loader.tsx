"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashLoaderSwordReveal5({ onComplete }: { onComplete: () => void }) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const lockTimer = setTimeout(() => {
      setIsLocked(true);
    }, 850);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#070708",
        overflow: "hidden",
      }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "6rem" }}>

          <motion.div
            style={{ position: "relative", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
              initial={{ x: -100, y: 0, opacity: 0, filter: "blur(5px)" }}
              animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            >
              <Image
                src="/kynasymbol.png"
                alt="Logo Top"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </motion.div>

            <motion.div
              style={{ position: "absolute", inset: 0, clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
              initial={{ x: 100, y: 0, opacity: 0, filter: "blur(5px)" }}
              animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            >
              <Image
                src="/kynasymbol.png"
                alt="Logo Bottom"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </motion.div>
          </motion.div>

          {isLocked && (
            <motion.div
              style={{
                color: "#fff",
                fontSize: "1.875rem",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                position: "absolute",
                left: "calc(100% + 0.5rem)",
              }}
              initial={{ clipPath: "inset(0 100% 0 0)", filter: "blur(8px)", opacity: 0 }}
              animate={{ clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              KYNA
            </motion.div>
          )}
        </div>

        <motion.div
          style={{
            position: "absolute",
            top: "85px",
            left: "calc(50% + 55px)",
            transform: "translateX(-50%)",
            width: "20px",
            height: "20px",
            border: "2px solid #27272a",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}
