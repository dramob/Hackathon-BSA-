'use client';

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useUser } from '../../contexts/UserContext';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const FloatingElement = styled.div`
  animation: ${float} 3s ease-in-out infinite;
`;

const BubbleEffect = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(5px);
  box-shadow: 
    inset 0 0 20px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(255, 255, 255, 0.2);
  &:before {
    content: '';
    position: absolute;
    top: 5%;
    left: 10%;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.2) 100%
    );
    filter: blur(2px);
  }
`;

export default function Profile() {
  const currentAccount = useCurrentAccount();
  const router = useRouter();
  const { power, level, resetIncrease, increase } = useUser();
  const [animatedPower, setAnimatedPower] = useState(0);
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [shopIconError, setShopIconError] = useState(false);
  const [giftIconError, setGiftIconError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isNewLevel, setIsNewLevel] = useState(false);
  const prevLevelRef = useRef(0);

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  useEffect(() => {
    const startPower = power - (increase?.powerIncrease || 0);
    const startLevel = level - (increase?.levelIncrease || 0);
    
    setAnimatedPower(startPower);
    setAnimatedLevel(startLevel);

    if (Math.floor(level) > prevLevelRef.current && (Math.floor(level) === 2 || Math.floor(level) === 3)) {
      setIsNewLevel(true);
      setTimeout(() => setIsNewLevel(false), 2000); // Reset after animation
    }
    prevLevelRef.current = Math.floor(level);

    const powerAnimation = setTimeout(() => {
      animatePower(startPower, power);
    }, 500);

    const levelAnimation = setTimeout(() => {
      animateLevel(startLevel, level);
    }, 500);

    return () => {
      clearTimeout(powerAnimation);
      clearTimeout(levelAnimation);
      resetIncrease();
    };
  }, [power, level, resetIncrease, increase]);

  useEffect(() => {
    if (Math.floor(animatedLevel) === 2 && Math.floor(level - (increase?.levelIncrease || 0)) < 2) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000); // Hide celebration after 3 seconds
    }
  }, [animatedLevel, level, increase]);

  const animatePower = (start: number, end: number) => {
    const duration = 1500; // 1.5 seconds
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = Math.floor(start + progress * (end - start));
      setAnimatedPower(currentValue);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const animateLevel = (start: number, end: number) => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const currentValue = start + progress * (end - start);
      setAnimatedLevel(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const levelPercentage = (animatedLevel % 1) * 100;

  const getAvatarImage = (level: number) => {
    if (level >= 3) {
      return "/app_UX/avatar/avatar3.png";
    } else if (level >= 2) {
      return "/app_UX/avatar/avatar2.png";
    }
    return "/app_UX/avatar/avatar1.png";
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#C4F9FF] to-[#D1FFE3] font-dosis relative pt-40">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <div className="fixed top-28 left-1/2 transform -translate-x-1/2 flex space-x-6 mb-4 z-10">
        <Link href="/profile" className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-3 px-8 rounded-full shadow-md text-base">PROFILE</Link>
        <Link href="/actions" className="bg-[#8FDDFF] text-white font-bold py-3 px-8 rounded-full shadow-md text-base">ACTIONS</Link>
        <Link href="/challenges" className="bg-[#8FDDFF] text-white font-bold py-3 px-8 rounded-full shadow-md text-base">CHALLENGES</Link>
      </div>
      {showCelebration && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-full animate-bounce">
            Level Up! Your avatar has evolved!
          </div>
        </div>
      )}
      <div className="bg-[#5EBAE7] p-8 rounded-3xl shadow-lg text-center max-w-md w-full relative mt-10">
        <div className="absolute top-4 left-4 w-14 h-14">
          <div className="bg-[#5EBAE7] rounded-full p-2 shadow-lg cursor-pointer w-full h-full flex items-center justify-center">
            {!shopIconError ? (
              <Image 
                src="/app_UX/icons/shop1.png" 
                alt="Shop" 
                width={40} 
                height={40} 
                onError={() => setShopIconError(true)}
                className="drop-shadow-lg"
              />
            ) : (
              <span className="text-white text-base font-bold">Shop</span>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4 w-14 h-14">
          <div className="bg-[#FFB7D5] rounded-full p-2 shadow-lg cursor-pointer w-full h-full flex items-center justify-center">
            {!giftIconError ? (
              <Image 
                src="/app_UX/icons/gift.png" 
                alt="Gift" 
                width={40} 
                height={40}
                onError={() => setGiftIconError(true)}
                className="drop-shadow-lg"
              />
            ) : (
              <span className="text-white text-base font-bold">Gift</span>
            )}
          </div>
        </div>
        <FloatingElement className="mb-4 relative w-[170px] h-[170px] mx-auto">
          <BubbleEffect />
          <div
            key={Math.floor(animatedLevel)}
            className="transition-all duration-500 ease-in-out"
            style={{
              opacity: isNewLevel ? 0 : 1,
              transform: isNewLevel ? 'scale(0.8)' : 'scale(1)',
            }}
          >
            <Image
              src={getAvatarImage(Math.floor(animatedLevel))}
              alt="Hydra Avatar"
              width={150}
              height={150}
              className="mx-auto rounded-full relative z-10"
            />
          </div>
          {isNewLevel && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-1500 ease-in-out"
              style={{
                opacity: isNewLevel ? 1 : 0,
                transform: isNewLevel ? 'scale(1)' : 'scale(1.5)',
              }}
            >
              <div className="text-yellow-400 text-4xl font-bold">
                {Math.floor(animatedLevel) === 2 ? "Level 2! Your avatar evolved!" : "Level 3! Your avatar evolved again!"}
              </div>
            </div>
          )}
        </FloatingElement>
        <h2 className="text-white text-xl font-bold mb-2">ANFAL</h2>
        <div className="text-white mb-4">
          <p className="font-bold text-lg">POWER <span className="text-[#FFE9A0]">{Math.round(animatedPower)}</span></p>
          <div className="bg-white rounded-full h-4 mt-2 overflow-hidden">
            <div 
              className="bg-[#FF7BA7] h-full rounded-full transition-all duration-1500 ease-out"
              style={{width: `${levelPercentage}%`}}
            ></div>
          </div>
          <p className="mt-1 text-sm">LEVEL <span className="text-[#FFE9A0]">{animatedLevel.toFixed(2)}</span></p>
        </div>
        <div className="flex justify-center space-x-4">
          <button className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-2 px-6 rounded-full shadow-md">ACHIEVEMENTS</button>
          <button className="bg-[#FFE9A0] text-[#FF7BA7] font-bold py-2 px-6 rounded-full shadow-md">SETTINGS</button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
