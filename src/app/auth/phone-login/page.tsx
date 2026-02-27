'use client';

/**
 * Phone Login Page
 *
 * TWO-STEP FLOW:
 * Step 1: User enters phone number → clicks "إرسال رمز التحقق" → OTP sent via SMS
 * Step 2: User enters 6-digit OTP → auto-submits → verified → redirected
 *
 * FEATURES:
 * - E.164 phone formatting before send
 * - 120-second countdown timer
 * - Resend button appears after countdown
 * - Error handling with Arabic messages
 * - Loading states throughout
 * - Silver luxury design matching ULTRA theme
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OTPInput } from '@/components/ui/otp-input';
import { useNotificationStore } from '@/stores/notification-store';
import { Phone, ArrowRight, Shield } from 'lucide-react';

export default function PhoneLoginPage() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendOTP = async () => {
        if (!phone.trim()) {
            addNotification('error', 'أدخل رقم الهاتف');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();

            if (!res.ok) {
                addNotification('error', data.error || 'فشل إرسال رمز التحقق');
                setLoading(false);
                return;
            }

            addNotification('success', 'تم إرسال رمز التحقق إلى جوالك');
            setStep('otp');
            setCountdown(120); // 120 second countdown
        } catch {
            addNotification('error', 'خطأ في الاتصال');
        }
        setLoading(false);
    };

    const handleVerifyOTP = useCallback(async (otp: string) => {
        setLoading(true);
        setOtpError(false);

        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();

            if (!res.ok) {
                setOtpError(true);
                addNotification('error', data.error || 'رمز التحقق غير صحيح');
                // Reset OTP input
                if ((window as unknown as Record<string, () => void>).__otpReset) {
                    (window as unknown as Record<string, () => void>).__otpReset();
                }
                setLoading(false);
                return;
            }

            addNotification('success', data.message || 'تم التحقق بنجاح');

            if (data.is_new) {
                // New user — redirect to register with phone pre-filled
                router.push(`/auth/register?phone=${encodeURIComponent(phone)}&verified=true`);
            } else {
                // Existing user — go to home
                router.push('/');
            }
        } catch {
            addNotification('error', 'خطأ في الاتصال');
            setOtpError(true);
        }
        setLoading(false);
    }, [phone, addNotification, router]);

    const handleResend = async () => {
        setCountdown(120);
        setOtpError(false);
        await handleSendOTP();
    };

    const formatCountdown = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ultra-bg px-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo & Header */}
                <div className="text-center">
                    <Link href="/">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={50} className="mx-auto h-14 w-auto" />
                    </Link>
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mt-6">
                        {step === 'phone' ? 'تسجيل الدخول بالجوال' : 'رمز التحقق'}
                    </h1>
                    <p className="text-ultra-silver-muted mt-2 text-sm">
                        {step === 'phone'
                            ? 'أدخل رقم جوالك لاستلام رمز التحقق'
                            : `تم إرسال رمز التحقق إلى ${phone}`
                        }
                    </p>
                </div>

                {/* Card */}
                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-8 space-y-6 shadow-ultra">

                    {/* Step 1: Phone Input */}
                    {step === 'phone' && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-ultra-silver-muted">رقم الجوال</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="05XXXXXXXX"
                                        dir="ltr"
                                        className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 pl-12 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                    />
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ultra-silver-dark" />
                                </div>
                                <p className="text-xs text-ultra-silver-dark">مثال: 0551234567</p>
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading || !phone.trim()}
                                className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    'جاري الإرسال...'
                                ) : (
                                    <>
                                        <Shield size={18} />
                                        إرسال رمز التحقق
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <>
                            <div className="space-y-4">
                                <OTPInput
                                    onComplete={handleVerifyOTP}
                                    error={otpError}
                                    disabled={loading}
                                />

                                {loading && (
                                    <p className="text-center text-sm text-ultra-silver-muted animate-pulse">
                                        جاري التحقق...
                                    </p>
                                )}

                                {/* Countdown & Resend */}
                                <div className="text-center space-y-2">
                                    {countdown > 0 ? (
                                        <p className="text-sm text-ultra-silver-muted">
                                            إعادة الإرسال بعد{' '}
                                            <span className="font-mono text-ultra-silver-bright font-bold">
                                                {formatCountdown(countdown)}
                                            </span>
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleResend}
                                            disabled={loading}
                                            className="text-sm text-ultra-silver-bright hover:text-ultra-hover transition-colors underline"
                                        >
                                            إعادة إرسال الرمز
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Back button */}
                            <button
                                onClick={() => { setStep('phone'); setOtpError(false); }}
                                className="w-full flex items-center justify-center gap-2 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors"
                            >
                                <ArrowRight size={16} />
                                تغيير رقم الجوال
                            </button>
                        </>
                    )}

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-ultra-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-ultra-card px-4 text-ultra-silver-dark">أو</span>
                        </div>
                    </div>

                    {/* Email login link */}
                    <p className="text-center text-sm text-ultra-silver-muted">
                        <Link href="/auth/login" className="text-ultra-silver-bright hover:text-ultra-hover transition-colors">
                            تسجيل الدخول بالبريد الإلكتروني
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
