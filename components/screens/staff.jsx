'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Card, Button, IconButton, Avatar, RoleBadge, Input, Select, Modal, Field, PageHeader, EmptyRow, EmptyState } from '../ui';
import { formatDate } from '@/lib/data';
import { isValidPhone, formatPhone, formatPhoneInput } from '@/lib/phone';

function StaffForm({ initial, roles = [], roleLocked = false, onSave, onCancel }) {
  const [name, setName]   = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone ? formatPhone(initial.phone) : '+998 ');
  const [role, setRole]   = useState(initial?.role || roles[0]?.value || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const phoneOk = isValidPhone(phone);
  const showPhoneError = phone.replace(/[\s+]/g, '').length > 3 && !phoneOk;
  const isNew = !initial;
  const passwordOk = !isNew || password.trim().length >= 6;

  return (
    <div className="space-y-4">
      <Field label="Toʻliq ism">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="masalan: Bobur Yusupov" />
      </Field>
      <Field label="Telefon">
        <Input value={phone}
               onChange={e => setPhone(formatPhoneInput(e.target.value))}
               icon="Phone" placeholder="+998 …" />
        {showPhoneError && (
          <div className="text-[11px] text-danger mt-1">Telefon raqami toʻliq emas. Masalan: +998 90 123 45 67</div>
        )}
      </Field>
      {roleLocked ? (
        <Field label="Lavozim">
          <div className="h-10 rounded-lg border border-ink-200 bg-ink-50 px-3 flex items-center">
            <RoleBadge role={initial?.role || role} />
          </div>
        </Field>
      ) : (
        <Field label="Lavozim">
          <Select value={role} onChange={e => setRole(e.target.value)}
                  options={roles.map(r => ({ value: r.value, label: r.label }))} />
        </Field>
      )}
      {isNew && (
        <Field label="Parol" hint="Kamida 6 ta belgi kiriting">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Parol"
              icon="Lock"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-md text-ink-500 hover:text-ink-800 hover:bg-ink-100"
            >
              <span className="sr-only">{showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}</span>
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} strokeWidth={2.25} className="text-current" />
            </button>
          </div>
          {password && !passwordOk && (
            <div className="text-[11px] text-danger mt-1">Parol kamida 6 ta belgidan iborat bo‘lishi kerak.</div>
          )}
        </Field>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        <Button
          variant="primary"
          icon="Check"
          onClick={() => onSave({ name, phone, role: roleLocked ? initial?.role : role, password: isNew ? password : undefined })}
          disabled={!name.trim() || !phoneOk || !passwordOk}
        >
          Saqlash
        </Button>
      </div>
    </div>
  );
}

function CurrentManagerCard({ manager, onEdit }) {
  if (!manager) return null;
  return (
    <Card className="mb-4 sm:mb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={manager.avatar} color={manager.color} size={48} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-semibold text-ink-900 truncate">{manager.name}</div>
              <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">
                Siz
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <RoleBadge role={manager.role} />
              <span className="text-[11px] text-ink-500 num">{manager.phone}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" icon="Pencil" size="sm" onClick={onEdit}>
          Tahrirlash
        </Button>
      </div>
    </Card>
  );
}

export default function StaffScreen({ staff, roles = [], zonesCount = 0, currentUserId, onSaveStaff, onRemoveStaff }) {
  const [modal, setModal]         = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [query, setQuery]         = useState('');
  const currentManager = staff.find(s => String(s.id) === String(currentUserId));

  const filtered = staff.filter(s => {
    if (currentManager && String(s.id) === String(currentManager.id)) return false;
    if (roleFilter && s.role !== roleFilter) return false;
    if (query && !(s.name + s.phone).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  async function saveStaff(data) {
    const editId = modal && modal.editId ? modal.editId : null;
    try {
      await onSaveStaff(data, editId);
      setModal(null);
    } catch (e) {
      alert(e.message || 'Saqlashda xatolik');
    }
  }

  async function removeStaff(id) {
    if (!confirm('Ushbu xodimni oʻchirishni xohlaysizmi?')) return;
    try { await onRemoveStaff(id); } catch (e) { alert(e.message || 'Oʻchirishda xatolik'); }
  }

  const editing = modal && modal.editId ? staff.find(s => s.id === modal.editId) : null;
  const editingCurrentManager = !!(editing && currentManager && String(editing.id) === String(currentManager.id));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Xodimlar"
        subtitle={`${staff.length} ta xodim · ${zonesCount} ta zona`}
        actions={
          <>
            <Button variant="outline" icon="Upload">CSV import</Button>
            <Button variant="primary" icon="UserPlus" onClick={() => setModal('add')}>Xodim qoʻshish</Button>
          </>
        }
      />

      <div className="lg:hidden mb-4 flex items-end justify-between gap-2">
        <p className="text-xs text-ink-500">{staff.length} ta xodim</p>
        <Button variant="primary" icon="UserPlus" size="sm" onClick={() => setModal('add')}>Qoʻshish</Button>
      </div>

      <CurrentManagerCard manager={currentManager} onEdit={() => setModal({ editId: currentManager.id })} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <Card className="!p-3 sm:!p-4">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Jami</div>
          <div className="mt-1 text-xl sm:text-2xl font-bold num text-ink-900">{staff.length}</div>
        </Card>
        <Card className="!p-3 sm:!p-4">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Menejerlar</div>
          <div className="mt-1 text-xl sm:text-2xl font-bold num text-navy-700">{staff.filter(s => s.role === 'Menejer').length}</div>
        </Card>
        <Card className="!p-3 sm:!p-4">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Ofitsiantlar</div>
          <div className="mt-1 text-xl sm:text-2xl font-bold num text-accent">{staff.filter(s => s.role === 'Ofitsiant').length}</div>
        </Card>
        <Card className="!p-3 sm:!p-4">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Oshxona</div>
          <div className="mt-1 text-xl sm:text-2xl font-bold num text-warn">{staff.filter(s => s.role === 'Oshpaz' || s.role === 'Kassir').length}</div>
        </Card>
      </div>

      <Card padding={false} className="mb-4">
        <div className="p-3 sm:p-4 flex flex-wrap gap-3 items-center">
          <Input icon="Search" placeholder="Ism yoki telefon boʻyicha…"
                 value={query} onChange={e => setQuery(e.target.value)} className="flex-1 min-w-[180px]" />
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                  placeholder="Barcha lavozimlar"
                  options={roles.map(r => ({ value: r.value, label: r.label }))}
                  className="w-40 sm:w-44" />
        </div>
      </Card>

      <div className="lg:hidden space-y-2">
        {filtered.length === 0 ? (
          <Card><EmptyState icon="UserX" text="Hech qanday xodim topilmadi" /></Card>
        ) : filtered.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-ink-100 shadow-card p-3.5 flex items-center gap-3">
            <Avatar initials={s.avatar} color={s.color} size={42} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink-900 text-sm truncate">{s.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <RoleBadge role={s.role} />
              </div>
              <div className="text-[11px] text-ink-500 num mt-0.5">{s.phone}</div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <IconButton name="Pencil" label="Tahrirlash" size={34} variant="ghost" onClick={() => setModal({ editId: s.id })} />
              <IconButton name="Trash2" label="Oʻchirish" size={34} variant="danger" onClick={() => removeStaff(s.id)} />
            </div>
          </div>
        ))}
      </div>

      <Card padding={false} className="hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/50 border-b border-ink-100">
              <th className="font-semibold px-5 py-2.5">Ism</th>
              <th className="font-semibold px-3 py-2.5">Telefon</th>
              <th className="font-semibold px-3 py-2.5">Lavozim</th>
              <th className="font-semibold px-3 py-2.5">Qoʻshilgan</th>
              <th className="font-semibold px-5 py-2.5 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.length === 0 ? (
              <EmptyRow colSpan={5} icon="UserX" text="Hech qanday xodim topilmadi" />
            ) : filtered.map(s => (
              <tr key={s.id} className="hover:bg-ink-50/60 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={s.avatar} color={s.color} size={36} />
                    <div>
                      <div className="font-medium text-ink-900">{s.name}</div>
                      <div className="text-[11px] text-ink-500 font-mono">ID · {s.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 num text-ink-700">{s.phone}</td>
                <td className="px-3 py-3"><RoleBadge role={s.role} /></td>
                <td className="px-3 py-3 text-ink-600 num">{formatDate(new Date(s.joined))}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton name="Pencil" label="Tahrirlash" size={30} variant="ghost" onClick={() => setModal({ editId: s.id })} />
                    <IconButton name="Trash2" label="Oʻchirish" size={30} variant="danger" onClick={() => removeStaff(s.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={editing ? 'Xodimni tahrirlash' : 'Xodim qoʻshish'} width={460}>
        {modal && (
          <StaffForm
            initial={editing}
            roles={roles}
            roleLocked={editingCurrentManager}
            onSave={saveStaff}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
