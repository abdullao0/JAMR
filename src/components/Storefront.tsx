import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import {
  GATHERING_BOXES,
  INDIVIDUAL_TRAYS,
  SEASONING_CHOICES,
  type IndividualTray,
} from '../data/store';
import { toAr } from '../storeLogic';
import type { CartLine, StoreItem } from '../types';

interface ProductCardProps {
  item: StoreItem;
  qty: number;
  selectedSeasoning: string;
  onOpen: (id: string) => void;
  onAdjust: (id: string, seasoning: string, delta: number) => void;
  onSeasoningChange: (id: string, seasoning: string) => void;
}

interface ImageProps {
  src: string;
  alt: string;
  className: string;
}

function ImageWithFallback({ src, alt, className }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${className} img-fallback-surface flex flex-col items-center justify-center p-4 text-center text-[#F5EFE6]`}>
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E05A2B]">
          <Icon name="flame" className="h-6 w-6" />
        </span>
        <span className="font-heading text-xs font-bold opacity-90">جمر — ملحمة الشوي المختصة</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export function ProductCard({
  item,
  qty,
  selectedSeasoning,
  onOpen,
  onAdjust,
  onSeasoningChange,
}: ProductCardProps) {
  if (item.type === 'box') {
    const seasoning = 'تتبيلة جمر المعتمدة للبوكس';
    const badgeClasses =
      item.badgeTone === 'gold'
        ? 'bg-[#B47B38] dark:bg-[#D4A359] text-white dark:text-[#12100E]'
        : 'bg-accent text-white';

    return (
      <article className="surface-card group flex flex-col justify-between overflow-hidden rounded-3xl border border-token transition-all duration-300 hover:border-token-strong">
        <div>
          <div
            className="img-fallback-surface relative h-52 cursor-pointer overflow-hidden sm:h-56"
            onClick={() => onOpen(item.id)}
          >
            <ImageWithFallback
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15"></div>
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold shadow ${badgeClasses}`}>
                <Icon name="sparkles" className="h-3.5 w-3.5" />
                <span>{item.badge}</span>
              </span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(item.id);
                }}
                type="button"
                aria-label="تفاصيل البوكس"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
              >
                <Icon name="eye" className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                <Icon name="users" className="h-3.5 w-3.5 text-amber-300" />
                <span>{toAr(item.servesLabel)}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-[#1E1B18] shadow-sm">
                <Icon name="scale" className="h-3.5 w-3.5 text-[#8B261D]" />
                <span>{toAr(item.weightLabel)}</span>
              </span>
            </div>
          </div>

          <div className="p-4 pb-3 sm:p-5 sm:pb-3">
            <h3
              onClick={() => onOpen(item.id)}
              className="mb-1.5 cursor-pointer font-heading text-lg font-black text-token-primary transition hover:text-accent sm:text-xl"
            >
              {item.name}
            </h3>
            <p className="mb-3.5 line-clamp-2 font-body text-xs leading-relaxed text-token-muted sm:text-sm">
              {item.summary}
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {item.contentsPills.map((pill) => (
                <span
                  key={pill}
                  className="surface-secondary inline-flex items-center gap-1 rounded-xl border border-token px-2.5 py-1 text-[11px] font-bold text-token-primary"
                >
                  <Icon name="check" className="h-3 w-3 text-accent" />
                  <span>{toAr(pill)}</span>
                </span>
              ))}
            </div>
            <button
              onClick={() => onOpen(item.id)}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-accent transition hover:opacity-80"
            >
              <Icon name="eye" className="h-3.5 w-3.5" />
              <span>تفاصيل البوكس</span>
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-token px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div>
            <span className="block font-body text-[10px] text-token-muted">سعر البوكس الكامل</span>
            <span className="font-heading text-xl font-black text-token-primary sm:text-2xl">
              {toAr(item.price)} <small className="text-xs font-extrabold text-accent">ر.س</small>
            </span>
          </div>
          {qty === 0 ? (
            <button
              onClick={() => onAdjust(item.id, seasoning, 1)}
              type="button"
              className="bg-accent shadow-ember flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-white transition hover:opacity-95 active:scale-95 sm:px-5 sm:py-3 sm:text-sm"
            >
              <Icon name="plus" className="h-4 w-4" />
              <span>أضف للسلة</span>
            </button>
          ) : (
            <QuantityStepper
              qty={qty}
              onIncrease={() => onAdjust(item.id, seasoning, 1)}
              onDecrease={() => onAdjust(item.id, seasoning, -1)}
              large
            />
          )}
        </div>
      </article>
    );
  }

  const seasoning = item.customizableSeasoning ? selectedSeasoning : 'تحضير طازج معتمد';

  return (
    <article className="surface-card group flex flex-col justify-between overflow-hidden rounded-3xl border border-token transition-all duration-300 hover:border-token-strong">
      <div>
        <div
          className="img-fallback-surface relative h-44 cursor-pointer overflow-hidden sm:h-48"
          onClick={() => onOpen(item.id)}
        >
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15"></div>
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-1.5">
            <span className="truncate rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[10px] font-bold text-amber-200 backdrop-blur-md">
              {item.badge}
            </span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onOpen(item.id);
              }}
              type="button"
              aria-label="عرض التفاصيل"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/60 text-white transition hover:bg-black/80"
            >
              <Icon name="eye" className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-[#1E1B18] shadow-sm">
              <Icon name="scale" className="h-3 w-3 text-[#8B261D]" />
              <span>{toAr(item.specPill)}</span>
            </span>
          </div>
        </div>

        <div className="p-4 pb-2.5">
          <div className="mb-0.5 font-body text-[11px] text-token-muted">{toAr(item.servesLabel)}</div>
          <h3
            onClick={() => onOpen(item.id)}
            className="mb-1 cursor-pointer truncate font-heading text-sm font-black text-token-primary transition hover:text-accent sm:text-base"
          >
            {item.name}
          </h3>
          <p className="mb-3 line-clamp-2 font-body text-xs leading-relaxed text-token-muted">{item.summary}</p>
          {item.customizableSeasoning ? (
            <div className="surface-secondary grid grid-cols-2 gap-1 rounded-xl border border-token p-1">
              {SEASONING_CHOICES.map((choice) => (
                <button
                  key={choice}
                  onClick={() => onSeasoningChange(item.id, choice)}
                  type="button"
                  className={`truncate rounded-lg px-2 py-1.5 text-center text-[10px] font-extrabold transition sm:text-[11px] ${
                    seasoning === choice
                      ? 'surface-card border border-token text-accent shadow-sm'
                      : 'text-token-muted hover:text-token-primary'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <div className="surface-secondary flex items-center gap-1.5 rounded-xl border border-token px-2.5 py-1.5 text-[11px] font-bold text-token-muted">
              <Icon name="droplet" className="h-3.5 w-3.5 text-accent" />
              <span>يُحضر طازجاً يوم التسليم</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-token px-4 pb-4 pt-2.5">
        <span className="font-heading text-lg font-black text-token-primary">
          {toAr(item.price)} <small className="text-xs font-extrabold text-accent">ر.س</small>
        </span>
        {qty === 0 ? (
          <button
            onClick={() => onAdjust(item.id, seasoning, 1)}
            type="button"
            className="bg-accent shadow-ember flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-extrabold text-white transition hover:opacity-95 active:scale-95"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
            <span>أضف للسلة</span>
          </button>
        ) : (
          <QuantityStepper
            qty={qty}
            onIncrease={() => onAdjust(item.id, seasoning, 1)}
            onDecrease={() => onAdjust(item.id, seasoning, -1)}
          />
        )}
      </div>
    </article>
  );
}

function QuantityStepper({
  qty,
  onIncrease,
  onDecrease,
  large = false,
}: {
  qty: number;
  onIncrease: () => void;
  onDecrease: () => void;
  large?: boolean;
}) {
  return (
    <div className={`surface-secondary flex items-center rounded-2xl border border-token-strong p-1 ${large ? 'gap-2' : 'gap-1.5 rounded-xl'}`}>
      <button
        onClick={onIncrease}
        type="button"
        aria-label="زيادة الكمية"
        className={`bg-accent flex items-center justify-center text-white ${large ? 'h-8 w-8 rounded-xl sm:h-9 sm:w-9' : 'h-7 w-7 rounded-lg'}`}
      >
        <Icon name="plus" className={large ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      </button>
      <span className={`text-token-primary min-w-[20px] text-center font-heading font-black ${large ? 'text-sm' : 'text-xs'}`}>
        {toAr(qty)}
      </span>
      <button
        onClick={onDecrease}
        type="button"
        aria-label="إنقاص الكمية"
        className={`surface-card border border-token text-token-primary flex items-center justify-center ${large ? 'h-8 w-8 rounded-xl sm:h-9 sm:w-9' : 'h-7 w-7 rounded-lg'}`}
      >
        <Icon name="minus" className={large ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      </button>
    </div>
  );
}

export function ProductQuickView({
  item,
  selectedSeasoning,
  onClose,
  onAdd,
  onSeasoningChange,
}: {
  item: StoreItem;
  selectedSeasoning: string;
  onClose: () => void;
  onAdd: (id: string, seasoning: string, delta: number) => void;
  onSeasoningChange: (id: string, seasoning: string) => void;
}) {
  const seasoning = item.type === 'box'
    ? 'تتبيلة جمر المعتمدة للبوكس'
    : item.customizableSeasoning
      ? selectedSeasoning
      : 'تحضير طازج معتمد';

  return (
    <>
      <div className="surface-card flex shrink-0 justify-center pt-2.5 pb-1 sm:hidden">
        <span className="h-1 w-10 rounded-full bg-stone-400/40"></span>
      </div>
      <div className="img-fallback-surface relative h-52 shrink-0 sm:h-64">
        <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
        <button
          onClick={onClose}
          type="button"
          aria-label="إغلاق"
          className="absolute left-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-black/65 text-white transition hover:bg-black/85"
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#E05A2B] px-3 py-1 text-[11px] font-extrabold">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            <span>{item.badge}</span>
          </span>
          <h3 className="font-heading text-xl font-black sm:text-2xl">{item.name}</h3>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Spec icon="users">{toAr(item.servesLabel)}</Spec>
          <Spec icon="scale">{toAr(item.type === 'box' ? item.weightLabel : item.specPill)}</Spec>
          <Spec icon="snowflake">مبرد طازج ٠ – ٤°م</Spec>
        </div>
        <p className="font-body text-xs leading-relaxed text-token-muted sm:text-sm">{item.summary}</p>

        {item.type === 'box' ? (
          <div className="surface-secondary space-y-2 rounded-2xl border border-token p-4">
            <h4 className="flex items-center gap-1.5 font-heading text-xs font-extrabold text-token-primary sm:text-sm">
              <Icon name="box" className="h-4 w-4 text-accent" />
              <span>محتويات البوكس التفصيلية:</span>
            </h4>
            <ul className="space-y-2 font-body text-xs text-token-primary sm:text-sm">
              {item.fullBreakdown.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-0.5 text-accent"><Icon name="check" className="h-4 w-4" /></span>
                  <span>{toAr(line)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : item.customizableSeasoning ? (
          <div>
            <h4 className="mb-2 text-xs font-extrabold text-token-primary">اختر تتبيلة الصحن قبل الإضافة:</h4>
            <div className="grid grid-cols-2 gap-2">
              {SEASONING_CHOICES.map((choice) => {
                const active = seasoning === choice;
                return (
                  <button
                    key={choice}
                    onClick={() => onSeasoningChange(item.id, choice)}
                    type="button"
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs font-extrabold transition ${
                      active ? 'bg-accent-soft border-current text-accent' : 'surface-secondary border-token text-token-primary'
                    }`}
                  >
                    <span className="truncate">{choice}</span>
                    {active && <Icon name="check" className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="bg-accent-soft flex items-start gap-3 rounded-2xl border border-token p-4">
          <span className="mt-0.5 text-accent"><Icon name="flameKindling" className="h-5 w-5" /></span>
          <div>
            <h5 className="mb-0.5 text-xs font-extrabold text-accent">نصيحة الجمر للشوي المثالي:</h5>
            <p className="font-body text-xs leading-relaxed text-token-primary">{toAr(item.grillTip)}</p>
          </div>
        </div>
      </div>

      <div className="surface-card flex shrink-0 items-center justify-between gap-4 border-t border-token p-4 sm:p-5">
        <div>
          <span className="block text-[11px] text-token-muted">السعر</span>
          <span className="font-heading text-xl font-black text-token-primary sm:text-2xl">
            {toAr(item.price)} <small className="text-xs font-extrabold text-accent">ر.س</small>
          </span>
        </div>
        <button
          onClick={() => {
            onAdd(item.id, seasoning, 1);
            onClose();
          }}
          type="button"
          className="bg-accent shadow-ember flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-extrabold text-white transition hover:opacity-95 sm:text-sm"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span>أضف إلى سلة الشوي</span>
        </button>
      </div>
    </>
  );
}

function Spec({ icon, children }: { icon: 'users' | 'scale' | 'snowflake'; children: ReactNode }) {
  return (
    <span className="surface-secondary inline-flex items-center gap-1.5 rounded-xl border border-token px-3 py-1.5 text-token-primary">
      <Icon name={icon} className="h-4 w-4 text-accent" />
      <span>{children}</span>
    </span>
  );
}

export function CartLineCard({
  line,
  product,
  onDelete,
  onAdjust,
}: {
  line: CartLine;
  product: StoreItem;
  onDelete: (key: string) => void;
  onAdjust: (id: string, seasoning: string, delta: number) => void;
}) {
  const lineTotal = product.price * line.qty;
  return (
    <div className="surface-secondary flex items-center gap-3 rounded-2xl border border-token p-3">
      <div className="img-fallback-surface h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <ImageWithFallback src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <h4 className="truncate font-heading text-xs font-extrabold text-token-primary sm:text-sm">{product.name}</h4>
          <button
            onClick={() => onDelete(line.key)}
            type="button"
            aria-label="حذف الصنف"
            className="shrink-0 p-1 text-token-muted transition hover:text-red-600"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px]">
          <span className="truncate font-bold text-accent">{line.seasoning}</span>
          <span className="text-token-muted">•</span>
          <span className="whitespace-nowrap text-token-muted">{toAr(product.price)} ر.س</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading text-xs font-black text-token-primary sm:text-sm">{toAr(lineTotal)} ر.س</span>
          <div className="surface-card flex items-center gap-1.5 rounded-xl border border-token p-0.5">
            <button
              onClick={() => onAdjust(product.id, line.seasoning, 1)}
              type="button"
              aria-label="زيادة"
              className="bg-accent flex h-6 w-6 items-center justify-center rounded-lg text-white"
            >
              <Icon name="plus" className="h-3 w-3" />
            </button>
            <span className="min-w-[20px] text-center text-xs font-black text-token-primary">{toAr(line.qty)}</span>
            <button
              onClick={() => onAdjust(product.id, line.seasoning, -1)}
              type="button"
              aria-label="إنقاص"
              className="surface-secondary flex h-6 w-6 items-center justify-center rounded-lg text-token-primary"
            >
              <Icon name="minus" className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpsellCard({
  item,
  onAdd,
}: {
  item: IndividualTray;
  onAdd: (id: string, seasoning: string, delta: number) => void;
}) {
  return (
    <div className="surface-secondary flex w-48 shrink-0 items-center gap-2.5 rounded-2xl border border-token p-2.5">
      <div className="img-fallback-surface h-11 w-11 shrink-0 overflow-hidden rounded-xl">
        <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold text-token-primary">{item.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-accent">{toAr(item.price)} ر.س</span>
          <button
            onClick={() => onAdd(item.id, 'تحضير طازج معتمد', 1)}
            type="button"
            className="bg-accent flex items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-extrabold text-white"
          >
            <Icon name="plus" className="h-3 w-3" />
            <span>أضف</span>
          </button>
        </div>
      </div>
    </div>
  );
}
