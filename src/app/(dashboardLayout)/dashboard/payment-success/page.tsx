'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { paymentService } from '@/services/payment.service';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [message, setMessage] = useState('Processing your payment...');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let mounted = true;
    let countdownInterval: NodeJS.Timeout;

    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setMessage('Invalid payment session. Please contact support.');
        return;
      }

      try {
        // Confirm the payment with the backend
        const result = await paymentService.handlePaymentSuccess(sessionId);

        if (!mounted) return;

        if (result.success) {
          setStatus('success');
          setMessage('Payment confirmed! Your subscription has been activated. Redirecting to your dashboard...');
          
          // Start countdown
          countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                router.push('/dashboard');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          // Check if it might still be processing
          if (result.error?.includes('Payment not completed') || result.error?.includes('session')) {
            setStatus('confirming');
            setMessage('Verifying payment with Stripe... This may take a moment.');
            // Retry after 2 seconds
            setTimeout(() => confirmPayment(), 2000);
          } else {
            setStatus('error');
            setMessage(result.error || 'Failed to confirm payment. Please contact support.');
          }
        }
      } catch (error) {
        if (!mounted) return;
        setStatus('error');
        setMessage('Error confirming payment. Please refresh the page or contact support.');
        console.error('Payment confirmation error:', error);
      }
    };

    void confirmPayment();

    return () => {
      mounted = false;
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [sessionId, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 to-black px-4">
      <div className="max-w-md w-full">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl p-8 text-center">
          {status === 'confirming' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="relative w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Processing Payment</h1>
              <p className="text-zinc-400 mb-6">{message}</p>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="relative w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Payment Confirmed!</h1>
              <p className="text-zinc-400 mb-6">{message}</p>
              <div className="space-y-3">
                <div className="text-sm font-medium text-zinc-300">Redirecting in {countdown}s...</div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="relative w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Payment Issue</h1>
              <p className="text-rose-300/80 mb-6 text-sm">{message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-11 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-all"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => router.push('/dashboard/subscriptions')}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all"
                >
                  Try Again
                </button>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                If the issue persists, please contact support with session ID: {sessionId || 'unknown'}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
