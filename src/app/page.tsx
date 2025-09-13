'use client';

import { useState, useEffect, useCallback } from 'react';
import PasswordGenerator from '@/components/PasswordGenerator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create floating particles
  const createParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 6 + 's',
            animationDuration: (Math.random() * 3 + 3) + 's',
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      );
    }
    return particles;
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-2xl text-blue-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {createParticles()}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border border-blue-400/20 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            <div className="text-sm text-blue-400 font-medium tracking-wider mb-2">
              W SOFTWARE SOLUTIONS
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2 font-['Orbitron'] tracking-wider">
              SecurePass Pro
            </h1>
            <p className="text-lg md:text-xl text-blue-300 font-light tracking-wide">
              Enterprise-Grade Password Generator
            </p>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
          
          {/* Company tagline */}
          <div className="mt-6 text-sm text-gray-400">
            Trusted by professionals worldwide for secure password generation
          </div>
        </header>

        {/* Password Generator Component */}
        <PasswordGenerator />

        {/* Footer */}
        <footer className="text-center mt-16 space-y-4">
          <div className="text-gray-400">
            <p className="text-sm">
              Powered by cryptographically secure algorithms
            </p>
          </div>
          
          {/* Company footer */}
          <div className="pt-4 border-t border-gray-700/50">
            <div className="text-blue-400 font-semibold text-sm mb-1">
              W Software Solutions
            </div>
            <p className="text-xs text-gray-500">
              Building secure, innovative software solutions for the modern world
            </p>
            <div className="flex justify-center items-center space-x-4 mt-3 text-xs text-gray-500">
              <span>© 2025 W Software Solutions</span>
              <span>•</span>
              <span>Enterprise Security</span>
              <span>•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
