'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Card, Button, Input, Select, Modal, Field, PageHeader, EmptyState } from '../ui';

function MenuItemForm({ initial, categories, onSave, onCancel }) {
  const [name, setName]         = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || categories[0]?.id);
  const [price, setPrice]       = useState(initial?.price || 0);

  return (
    <div className="space-y-4">
      <Field label="Taom nomi">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="masalan: Qoʻyli palov" />
      </Field>
      <Field label="Kategoriya">
        <Select value={category} onChange={e => setCategory(e.target.value)}
                options={categories.map(c => ({ value: c.id, label: c.name }))} />
      </Field>
      <Field label="Narxi (soʻm)" hint="Faqat son kiriting">
        <Input type="number" value={price} onChange={e => setPrice(+e.target.value || 0)} icon="Tag" placeholder="0" />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        <Button variant="primary" icon="Check" onClick={() => onSave({ name, category, price })} disabled={!name.trim() || !price}>
          Saqlash
        </Button>
      </div>
    </div>
  );
}

const CATEGORY_ICONS = [
  'Utensils','UtensilsCrossed','Soup','Salad','Flame','Cake','CupSoda','Coffee',
  'Pizza','Sandwich','Fish','Beef','Egg','Apple','IceCream','Cookie','Wine','Beer',
  'Milk','ChefHat','Leaf','Carrot','Wheat','Cherry','Lemon','Banana','Star','Drumstick',
  'Candy','Popcorn','Grape','Croissant',
];

function CategoryForm({ onSave, onCancel }) {
  const [name, setName]   = useState('');
  const [icon, setIcon]   = useState('Utensils');

  return (
    <div className="space-y-4">
      <Field label="Kategoriya nomi">
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="masalan: Nonushta" />
      </Field>
      <Field label="Icon tanlang">
        <div className="grid grid-cols-8 gap-1.5 p-1">
          {CATEGORY_ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => setIcon(ic)}
              title={ic}
              className={`w-full aspect-square flex items-center justify-center rounded-lg border transition ${
                icon === ic
                  ? 'bg-navy-700 text-white border-navy-700 shadow-sm'
                  : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50 hover:border-accent/40'
              }`}>
              <Icon name={ic} size={18} />
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-ink-500">
          <div className="w-6 h-6 rounded-md bg-navy-50 flex items-center justify-center">
            <Icon name={icon} size={14} className="text-navy-700" />
          </div>
          Tanlangan: <span className="font-medium text-ink-700">{icon}</span>
        </div>
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        <Button variant="primary" icon="Check" onClick={() => onSave({ name, icon })} disabled={!name.trim()}>Qoʻshish</Button>
      </div>
    </div>
  );
}

export default function MenuScreen({ menu, categories, onSaveItem, onDeleteItem, onAddCategory }) {
  const [activeCat, setActiveCat] = useState('all');
  const [modal, setModal]         = useState(null);
  const [catModal, setCatModal]   = useState(false);
  const [search, setSearch]       = useState('');
  const [busy, setBusy]           = useState(false);

  const filtered = menu.filter(m => {
    if (activeCat !== 'all' && m.category !== activeCat) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function countFor(catId) { return menu.filter(m => m.category === catId).length; }

  async function saveItem(item) {
    const editId = modal && modal.editId ? modal.editId : null;
    setBusy(true);
    try {
      await onSaveItem(item, editId);
      setModal(null);
    } catch (e) {
      alert(e.message || 'Saqlashda xatolik');
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(id) {
    try { await onDeleteItem(id); } catch (e) { alert(e.message || 'Oʻchirishda xatolik'); }
  }

  async function addCategory(data) {
    setBusy(true);
    try {
      await onAddCategory(data);
      setCatModal(false);
    } catch (e) {
      alert(e.message || 'Kategoriya qoʻshishda xatolik');
    } finally {
      setBusy(false);
    }
  }

  const editing = modal && modal.editId ? menu.find(m => m.id === modal.editId) : null;
  const activeCatObj = categories.find(c => c.id === activeCat);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Menyu"
        subtitle={`${menu.length} ta taom · ${categories.length} ta kategoriya`}
        actions={
          <>
            <Button variant="outline" icon="Upload">Import</Button>
            <Button variant="primary" icon="Plus" onClick={() => setModal('add')}>Taom qoʻshish</Button>
          </>
        }
      />

      <div className="lg:hidden mb-3 space-y-3">
        <Input icon="Search" placeholder="Taom qidirish…"
               value={search} onChange={e => setSearch(e.target.value)} />
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max pb-1">
            <button onClick={() => setActiveCat('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
                activeCat === 'all' ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
              }`}>
              <Icon name="LayoutGrid" size={12} />
              Barchasi ({menu.length})
            </button>
            {categories.map(c => {
              const active = activeCat === c.id;
              return (
                <button key={c.id} onClick={() => setActiveCat(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
                    active ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
                  }`}>
                  <Icon name={c.icon} size={12} />
                  {c.short || c.name} ({countFor(c.id)})
                </button>
              );
            })}
            <button onClick={() => setCatModal(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-dashed border-accent text-accent flex items-center gap-1">
              <Icon name="Plus" size={12} /> Yangi
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <aside className="hidden lg:block col-span-3">
          <Card padding={false}>
            <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-800">Kategoriyalar</h3>
              <span className="text-[11px] text-ink-400 num">{categories.length}</span>
            </div>
            <div className="p-2 space-y-0.5">
              <button
                onClick={() => setActiveCat('all')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeCat === 'all' ? 'bg-navy-700 text-white' : 'text-ink-700 hover:bg-ink-100'
                }`}
              >
                <Icon name="LayoutGrid" size={16} />
                <span className="flex-1 text-left">Barcha taomlar</span>
                <span className={`text-[11px] num px-1.5 py-0.5 rounded-md ${
                  activeCat === 'all' ? 'bg-white/20' : 'bg-ink-100 text-ink-500'
                }`}>{menu.length}</span>
              </button>
              {categories.map(c => {
                const active = activeCat === c.id;
                const count = countFor(c.id);
                return (
                  <button key={c.id} onClick={() => setActiveCat(c.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      active ? 'bg-navy-700 text-white' : 'text-ink-700 hover:bg-ink-100'
                    }`}>
                    <Icon name={c.icon} size={16} />
                    <span className="flex-1 text-left truncate">{c.short || c.name}</span>
                    <span className={`text-[11px] num px-1.5 py-0.5 rounded-md ${
                      active ? 'bg-white/20' : 'bg-ink-100 text-ink-500'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t border-ink-100">
              <button onClick={() => setCatModal(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-accent border border-dashed border-accent/40 hover:bg-accent-50 transition">
                <Icon name="Plus" size={14} /> Kategoriya qoʻshish
              </button>
            </div>
          </Card>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          <div className="hidden lg:flex items-center gap-3 mb-4">
            <Input icon="Search" placeholder={`${activeCat === 'all' ? 'Barcha taomlar' : (activeCatObj?.name || '')} ichidan qidirish…`}
                   value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
            <Select value="" onChange={() => {}} placeholder="Saralash: Nomi A→Z"
                    options={[
                      { value: 'name', label: 'Nomi A→Z' },
                      { value: 'price', label: 'Narxi past→yuqori' },
                      { value: 'price-desc', label: 'Narxi yuqori→past' },
                    ]} className="w-52" />
          </div>

          {filtered.length === 0 ? (
            <Card className="text-center py-12 sm:py-16">
              <div className="inline-flex flex-col items-center gap-3 text-ink-400">
                <div className="w-12 h-12 rounded-full bg-ink-100 inline-flex items-center justify-center">
                  <Icon name="Soup" size={22} />
                </div>
                <div className="text-sm">Bu kategoriyada hali taom yoʻq</div>
                <Button variant="primary" icon="Plus" onClick={() => setModal('add')}>Birinchi taomni qoʻshing</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(item => {
                const cat = categories.find(c => c.id === item.category);
                return (
                  <div key={item.id}
                       className="group bg-white rounded-xl border border-ink-100 shadow-card overflow-hidden hover:shadow-pop hover:border-accent/40 active:scale-[0.98] transition cursor-pointer"
                       onClick={() => setModal({ editId: item.id })}>
                    <div className="h-24 sm:h-28 relative overflow-hidden"
                         style={{ background: `repeating-linear-gradient(135deg, #f1f5fa, #f1f5fa 10px, #e1eaf3 10px, #e1eaf3 20px)` }}>
                      <div className="absolute inset-0 flex items-center justify-center text-navy-300">
                        <Icon name={cat?.icon || 'Utensils'} size={28} />
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-ink-700 border border-ink-100 max-w-[120px]">
                          <Icon name={cat?.icon || 'Utensils'} size={10} />
                          <span className="truncate">{cat?.short || cat?.name}</span>
                        </span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-md bg-white/95 border border-ink-100 text-ink-500 inline-flex items-center justify-center md:opacity-0 group-hover:opacity-100 hover:text-danger transition">
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-ink-900 text-sm leading-snug line-clamp-2 min-h-[2.5em]">{item.name}</div>
                      <div className="flex items-baseline justify-between mt-2">
                        <div className="num font-bold text-navy-700 text-sm">
                          {new Intl.NumberFormat('en-US').format(item.price).replace(/,/g, ' ')} <span className="text-ink-400 text-[10px] font-normal">soʻm</span>
                        </div>
                        <Icon name="Pencil" size={14} className="text-ink-300 group-hover:text-accent transition" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setModal('add')}
        className="lg:hidden fixed right-4 z-30 w-14 h-14 rounded-full bg-navy-700 text-white shadow-pop hover:bg-navy-800 active:scale-95 inline-flex items-center justify-center transition"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
        <Icon name="Plus" size={22} />
      </button>

      <Modal open={!!modal} onClose={() => setModal(null)} title={editing ? 'Taomni tahrirlash' : 'Taom qoʻshish'} width={460}>
        {modal && <MenuItemForm initial={editing} categories={categories} onSave={saveItem} onCancel={() => setModal(null)} />}
      </Modal>

      <Modal open={catModal} onClose={() => setCatModal(false)} title="Kategoriya qoʻshish" width={400}>
        <CategoryForm onSave={addCategory} onCancel={() => setCatModal(false)} />
      </Modal>
    </div>
  );
}
