'use client';
import { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { LoginField, PhoneInput, Btn } from './login-ui';
import { otpRequest, otpVerify } from '@/lib/services';

const BOT_HANDLE = '@OrderiX_AuthBot';

function formatPhone(digits) {
  const d = digits.replace(/\D/g, '').slice(0, 9);
  let out = '';
  if (d.length >= 1) out += d.slice(0, 2);
  if (d.length >= 3) out += ' ' + d.slice(2, 5);
  if (d.length >= 6) out += ' ' + d.slice(5, 7);
  if (d.length >= 8) out += ' ' + d.slice(7, 9);
  return out;
}

function OtpBoxes({ value, onChange, error }) {
  const refs = useRef([]);

  function setAt(i, v) {
    const digit = (v || '').replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    while (arr.length < 6) arr.push('');
    arr[i] = digit;
    onChange(arr.slice(0, 6).join(''));
    if (digit && refs.current[i + 1]) refs.current[i + 1].focus();
  }

  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && refs.current[i - 1]) refs.current[i - 1].focus();
    if (e.key === 'ArrowLeft' && refs.current[i - 1]) refs.current[i - 1].focus();
    if (e.key === 'ArrowRight' && refs.current[i + 1]) refs.current[i + 1].focus();
  }

  function onPaste(e) {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const digits = text.replace(/\D/g, '').slice(0, 6);
    if (digits) {
      e.preventDefault();
      onChange(digits.padEnd(0));
      const target = Math.min(digits.length, 5);
      if (refs.current[target]) refs.current[target].focus();
    }
  }

  return (
    <div className={`flex gap-1.5 sm:gap-2 justify-between ${error ? 'anim-shake' : ''}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={e => setAt(i, e.target.value)}
          onKeyDown={e => onKeyDown(i, e)}
          onPaste={onPaste}
          inputMode="numeric"
          maxLength={1}
          autoFocus={i === 0}
          className={`w-11 sm:w-12 text-center text-xl sm:text-2xl font-bold num rounded-xl border-2 bg-white outline-none transition ${
            error ? 'border-danger text-danger' :
            value[i] ? 'border-navy-700 text-navy-800' :
            'border-ink-200 text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/15'
          }`}
          style={{ height: 56 }}
        />
      ))}
    </div>
  );
}

export default function TelegramForm({ onSuccess }) {
  const [step, setStep]         = useState('phone');
  const [phone, setPhone]       = useState('');
  const [code, setCode]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError]       = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const [demoCode, setDemoCode] = useState(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function sendCode() {
    setError(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 9) { setError('Telefon raqamni toʻliq kiriting'); return; }
    setLoading(true);
    try {
      const data = await otpRequest('+998' + digits);
      setDemoCode(data?.code || null);
      setResendIn(45);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Kod yuborishda xatolik');
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    if (code.length !== 6) { setError('6 xonali kodni kiriting'); return; }
    setVerifying(true);
    try {
      const digits = phone.replace(/\D/g, '');
      const data = await otpVerify('+998' + digits, code);
      onSuccess({ ...data, method: 'telegram' });
    } catch (err) {
      setError(err.message || 'Kod notoʻgʻri');
      setVerifying(false);
    }
  }

  useEffect(() => {
    if (step === 'otp' && code.length === 6 && !verifying) {
      const t = setTimeout(() => verify(), 200);
      return () => clearTimeout(t);
    }
  }, [code, step]);

  if (step === 'phone') {
    return (
      <div className={`space-y-4 ${error ? 'anim-shake' : ''}`}>
        <LoginField label="Telefon raqamingiz" hint="Bizning Telegram botimiz shu raqamga kod yuboradi" error={error}>
          <PhoneInput
            value={formatPhone(phone)}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
            placeholder="90 123 45 67"
            autoFocus
          />
        </LoginField>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#e8f4fa] border border-[#bde0f0]">
          <div className="w-10 h-10 rounded-full bg-telegram flex items-center justify-center shrink-0">
            <Icon name="Send" size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-900">Telegram orqali tasdiqlash</div>
            <div className="text-[11.5px] text-ink-600 mt-0.5 leading-relaxed">
              Kirish kodi <span className="font-mono font-semibold text-telegram">{BOT_HANDLE}</span> botidan keladi.
              Agar siz bilan birinchi marta — botni Telegramda oching va <span className="font-mono font-semibold">/start</span> bosing.
            </div>
          </div>
        </div>

        <Btn variant="telegram" icon="Send" onClick={sendCode} loading={loading}>Kodni yuborish</Btn>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50 border border-ink-100">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-telegram flex items-center justify-center anim-pulse">
            <Icon name="Send" size={15} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink-900">Kod yuborildi</div>
          <div className="text-[11.5px] text-ink-500 font-mono truncate">+998 {formatPhone(phone)} · Telegram</div>
        </div>
        <button onClick={() => { setStep('phone'); setCode(''); setError(null); }}
          className="text-xs font-medium text-accent hover:underline whitespace-nowrap">Oʻzgartirish</button>
      </div>

      <LoginField label="Telegram kodi" error={error}>
        <OtpBoxes value={code} onChange={setCode} error={error} />
      </LoginField>

      {demoCode && (
        <div className="text-[11px] text-ink-500 text-center">
          <span className="opacity-70">Demo kod (haqiqiy botda yuborilgan boʻlardi):</span>{' '}
          <span className="font-mono font-bold text-navy-700 num">{demoCode}</span>
        </div>
      )}

      <Btn icon="ShieldCheck" onClick={verify} loading={verifying} disabled={code.length !== 6}>
        Tasdiqlash va kirish
      </Btn>

      <div className="text-center">
        {resendIn > 0 ? (
          <span className="text-xs text-ink-500">Qayta yuborish <span className="font-semibold num text-ink-700">{resendIn}s</span></span>
        ) : (
          <button onClick={sendCode} className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1">
            <Icon name="RotateCw" size={12} /> Kodni qayta yuborish
          </button>
        )}
      </div>

      <a href="https://t.me/" target="_blank" rel="noopener noreferrer"
         className="block text-center text-xs font-medium text-telegram hover:underline">
        Telegramni ochish →
      </a>
    </div>
  );
}
