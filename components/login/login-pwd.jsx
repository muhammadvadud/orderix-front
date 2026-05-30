'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { LoginField, PasswordInput, Btn } from './login-ui';
import { loginPassword } from '@/lib/services';

export default function PasswordForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  async function submit(e) {
    e && e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Foydalanuvchi nomi va parolni kiriting');
      return;
    }
    setLoading(true);
    try {
      const data = await loginPassword(username, password);
      onSuccess({ ...data, method: 'password', remember });
    } catch (err) {
      setError(err.message || 'Telefon raqam yoki parol notoʻgʻri');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className={`space-y-4 ${error ? 'anim-shake' : ''}`}>
      <LoginField label="Telefon yoki foydalanuvchi nomi">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            <Icon name="User" size={16} />
          </span>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="masalan: aziza yoki +998 90 123 45 67"
            autoComplete="username"
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition text-sm"
          />
        </div>
      </LoginField>

      <LoginField label="Parol" error={error}>
        <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </LoginField>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                 className="w-4 h-4 rounded border-ink-300 text-navy-700 focus:ring-accent" />
          <span className="text-xs text-ink-600">Meni eslab qol</span>
        </label>
        <button type="button" className="text-xs font-medium text-accent hover:underline">Parolni unutdingizmi?</button>
      </div>

      <Btn type="submit" loading={loading} iconRight="ArrowRight">Kirish</Btn>

      <div className="text-center text-xs text-ink-500">
        Telefon raqamingiz va parolingiz bilan kiring
      </div>
    </form>
  );
}
