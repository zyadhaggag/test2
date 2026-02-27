'use client';

/**
 * OTP Input Component — Luxury 6-Digit Input
 *
 * HOW IT WORKS:
 * - 6 separate <input> elements, each accepts exactly 1 digit
 * - Managed via an array of refs for instant focus control
 * - Typing a digit → auto-advances to next box
 * - Backspace → goes back to previous box
 * - Paste support → distributes digits across all boxes
 * - Auto-submit when all 6 digits are filled
 *
 * STATE MANAGEMENT:
 * - `values` array: ['', '', '', '', '', ''] → each slot holds 1 digit
 * - When all 6 are filled → calls `onComplete(joinedValue)`
 * - Parent component handles submission logic
 *
 * DESIGN:
 * - Silver luxury theme matching the rest of ULTRA
 * - Error state: red border + shake animation
 * - Disabled state: reduced opacity when verifying
 */

import { useRef, useState, useEffect, useCallback, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    error?: boolean;
    disabled?: boolean;
}

export function OTPInput({ length = 6, onComplete, error = false, disabled = false }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Auto-submit when all digits filled
    useEffect(() => {
        if (values.every((v) => v !== '')) {
            onComplete(values.join(''));
        }
    }, [values, onComplete]);

    const handleChange = (index: number, value: string) => {
        // Only accept digits
        const digit = value.replace(/\D/g, '').slice(-1);
        if (!digit && value !== '') return;

        const newValues = [...values];
        newValues[index] = digit;
        setValues(newValues);

        // Auto-advance to next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Backspace → go to previous input
        if (e.key === 'Backspace') {
            if (values[index] === '' && index > 0) {
                const newValues = [...values];
                newValues[index - 1] = '';
                setValues(newValues);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newValues = [...values];
                newValues[index] = '';
                setValues(newValues);
            }
        }

        // Arrow keys navigation
        if (e.key === 'ArrowRight' && index > 0) {
            inputRefs.current[index - 1]?.focus(); // RTL: right goes back
        }
        if (e.key === 'ArrowLeft' && index < length - 1) {
            inputRefs.current[index + 1]?.focus(); // RTL: left goes forward
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (!pastedData) return;

        const newValues = [...values];
        for (let i = 0; i < pastedData.length; i++) {
            newValues[i] = pastedData[i];
        }
        setValues(newValues);

        // Focus the next empty input or the last one
        const nextEmpty = newValues.findIndex((v) => v === '');
        if (nextEmpty >= 0) {
            inputRefs.current[nextEmpty]?.focus();
        } else {
            inputRefs.current[length - 1]?.focus();
        }
    };

    // Reset function for parent to call
    const reset = useCallback(() => {
        setValues(Array(length).fill(''));
        inputRefs.current[0]?.focus();
    }, [length]);

    // Expose reset via the component (attached to window for simplicity)
    useEffect(() => {
        (window as unknown as Record<string, () => void>).__otpReset = reset;
        return () => { delete (window as unknown as Record<string, () => void>).__otpReset; };
    }, [reset]);

    return (
        <div
            className={`flex gap-3 justify-center ${error ? 'animate-shake' : ''}`}
            dir="ltr"
        >
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    className={`
            w-12 h-14 text-center text-xl font-bold
            rounded-xl border-2 outline-none
            transition-all duration-ultra
            bg-ultra-surface text-ultra-silver-bright
            ${error
                            ? 'border-red-500/60'
                            : value
                                ? 'border-ultra-silver-muted shadow-glow'
                                : 'border-ultra-border'
                        }
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'focus:border-ultra-silver-muted focus:shadow-glow'}
          `}
                    aria-label={`رقم ${index + 1}`}
                />
            ))}
        </div>
    );
}
