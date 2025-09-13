'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('CLICK GENERATE');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({ score: 0, label: 'Weak', color: '#ff4444' });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const resultContainerRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  // Password generation functions
  const getRandomLower = (): string => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  };

  const getRandomUpper = (): string => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  };

  const getRandomNumber = (): string => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return String.fromCharCode(Math.floor((array[0] / (Math.pow(2, 32) - 1)) * 10) + 48);
  };

  const getRandomSymbol = (): string => {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return symbols[Math.floor((array[0] / (Math.pow(2, 32) - 1)) * symbols.length)];
  };

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string): PasswordStrength => {
    let score = 0;
    let label = 'Weak';
    let color = '#ff4444';

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 16) score += 1;

    if (score >= 6) {
      label = 'Very Strong';
      color = '#00ff00';
    } else if (score >= 5) {
      label = 'Strong';
      color = '#ffff00';
    } else if (score >= 3) {
      label = 'Medium';
      color = '#ffaa00';
    }

    return { score: (score / 7) * 100, label, color };
  }, []);

  // Generate password
  const generatePassword = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;
      
      const functions = [];
      if (includeLowercase) functions.push(getRandomLower);
      if (includeUppercase) functions.push(getRandomUpper);
      if (includeNumbers) functions.push(getRandomNumber);
      if (includeSymbols) functions.push(getRandomSymbol);

      if (functions.length === 0) {
        setPassword('Select at least one option');
        setIsGenerating(false);
        return;
      }

      let generatedPassword = '';
      
      // Ensure at least one character from each selected type
      functions.forEach(func => {
        generatedPassword += func();
      });

      // Fill the remaining length
      for (let i = generatedPassword.length; i < length; i++) {
        const randomFunc = functions[Math.floor(Math.random() * functions.length)];
        generatedPassword += randomFunc();
      }

      // Shuffle the password
      generatedPassword = generatedPassword
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

      setPassword(generatedPassword);
      setPasswordGenerated(true);
      setCopied(false);
      setStrength(calculateStrength(generatedPassword));
      setIsGenerating(false);
    }, 300);
  }, [options, calculateStrength]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!password || password === 'CLICK GENERATE' || password === 'Select at least one option') return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  // Handle mouse move for copy button positioning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!passwordGenerated || !copyBtnRef.current || !resultContainerRef.current) return;

    const rect = resultContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    copyBtnRef.current.style.setProperty('--x', `${x}px`);
    copyBtnRef.current.style.setProperty('--y', `${y}px`);
    copyBtnRef.current.style.opacity = '1';
    copyBtnRef.current.style.pointerEvents = 'all';
  }, [passwordGenerated]);

  const handleMouseLeave = useCallback(() => {
    if (!copyBtnRef.current) return;
    copyBtnRef.current.style.opacity = '0';
    copyBtnRef.current.style.pointerEvents = 'none';
  }, []);

  // Handle option changes with at least one option selected
  const handleOptionChange = useCallback((option: keyof Omit<PasswordOptions, 'length'>) => {
    setOptions(prev => {
      const newOptions = { ...prev, [option]: !prev[option] };
      
      // Ensure at least one option is selected
      const hasAtLeastOne = newOptions.includeUppercase || 
                           newOptions.includeLowercase || 
                           newOptions.includeNumbers || 
                           newOptions.includeSymbols;
      
      if (!hasAtLeastOne) {
        return prev; // Don't allow unchecking if it's the last option
      }
      
      return newOptions;
    });
  }, []);

  // Update strength when password changes
  useEffect(() => {
    if (password && password !== 'CLICK GENERATE' && password !== 'Select at least one option') {
      setStrength(calculateStrength(password));
    }
  }, [password, calculateStrength]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Password Display */}
      <div 
        ref={resultContainerRef}
        className="glass p-6 mb-8 relative overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-blue-300">Generated Password</h2>
          {passwordGenerated && password !== 'Select at least one option' && (
            <div className="text-sm text-gray-400">
              Length: {password.length}
            </div>
          )}
        </div>
        
        <div 
          className={`
            bg-black/30 p-4 rounded-lg border border-blue-500/30 min-h-[60px] 
            flex items-center justify-center text-center cursor-pointer
            transition-all duration-300 hover:border-blue-400/50 relative
            ${passwordGenerated ? 'hover:bg-black/40' : ''}
          `}
          onClick={passwordGenerated ? copyToClipboard : undefined}
        >
          <span 
            className={`
              font-mono text-lg break-all select-all px-2
              ${passwordGenerated ? 'text-blue-100' : 'text-gray-500'}
              ${isGenerating ? 'animate-pulse' : ''}
            `}
          >
            {isGenerating ? 'Generating...' : password}
          </span>

          {/* Copy Button */}
          <button
            ref={copyBtnRef}
            className="copy-btn"
            style={{
              left: 'var(--x, 50%)',
              top: 'var(--y, 50%)',
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
          >
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        {/* Status Messages - Fixed positioning */}
        <div className="mt-3 min-h-[20px] flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {copied ? (
              <span className="text-green-400 font-medium">✓ Password copied to clipboard!</span>
            ) : passwordGenerated && password !== 'Select at least one option' ? (
              <span>Hover and click to copy password</span>
            ) : (
              <span>Configure options and generate a password</span>
            )}
          </div>
          
          {passwordGenerated && password !== 'Select at least one option' && (
            <button
              onClick={copyToClipboard}
              className="text-xs px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full
                         hover:bg-blue-600/30 hover:border-blue-400/50 transition-all duration-200
                         text-blue-300 hover:text-blue-200"
            >
              Copy Password
            </button>
          )}
        </div>

        {/* Password Strength Indicator */}
        {passwordGenerated && password !== 'Select at least one option' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Security Strength:</span>
              <span className="text-sm font-semibold" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${strength.score}%`, 
                  background: `linear-gradient(90deg, #ff4444, ${strength.color})` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="glass p-6 space-y-6">
        {/* Length Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium text-blue-300">Password Length</label>
            <span className="text-2xl font-bold text-cyan-400 font-mono">
              {options.length}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="4"
              max="64"
              value={options.length}
              onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
              className="range-slider w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>4</span>
              <span>16</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>
        </div>

        {/* Options Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'includeUppercase' as const, label: 'Uppercase Letters', desc: 'A-Z' },
            { key: 'includeLowercase' as const, label: 'Lowercase Letters', desc: 'a-z' },
            { key: 'includeNumbers' as const, label: 'Numbers', desc: '0-9' },
            { key: 'includeSymbols' as const, label: 'Symbols', desc: '!@#$' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="checkbox-container">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => handleOptionChange(key)}
              />
              <span className="checkmark"></span>
              <div className="flex flex-col">
                <span className="text-white font-medium">{label}</span>
                <span className="text-gray-400 text-sm">{desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          disabled={isGenerating}
          className={`
            btn-neon w-full py-4 text-lg font-bold relative overflow-hidden
            ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            transition-all duration-300
          `}
        >
          <span className="relative z-10">
            {isGenerating ? 'GENERATING SECURE PASSWORD...' : 'GENERATE SECURE PASSWORD'}
          </span>
          {!isGenerating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] 
                           transition-transform duration-1000"></div>
          )}
        </button>
      </div>

      {/* Professional Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="glass p-4 text-center">
          <div className="text-2xl mb-2">🔐</div>
          <h3 className="font-semibold text-blue-300 mb-1">Enterprise Security</h3>
          <p className="text-xs text-gray-400">Cryptographically secure random generation</p>
        </div>
        
        <div className="glass p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold text-blue-300 mb-1">Instant Generation</h3>
          <p className="text-xs text-gray-400">Lightning-fast password creation</p>
        </div>
        
        <div className="glass p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-blue-300 mb-1">Strength Analysis</h3>
          <p className="text-xs text-gray-400">Real-time security assessment</p>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="glass p-6 mt-6">
        <h3 className="font-semibold text-blue-300 mb-4 text-center">�️ Security Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Use unique passwords for each account</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Include multiple character types</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Use passwords 12+ characters long</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Store passwords in a secure manager</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Enable two-factor authentication</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Never share passwords via email/text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}