import {
  DELIVERY_DAYS,
  DELIVERY_FEE,
  DELIVERY_WINDOWS,
  FREE_DELIVERY_MIN,
  GATHERING_BOXES,
  INDIVIDUAL_TRAYS,
} from './data/store';
import type { CartLine, StoreItem } from './types';

export interface DeliveryDetails {
  dayId: string;
  windowId: string;
  neighborhood: string;
  customerName: string;
  customerPhone: string;
  notes: string;
}

export function toAr(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
}

export interface CartSummary {
  lines: CartLine[];
  count: number;
  subtotal: number;
  fee: number;
  grandTotal: number;
  pct: number;
  remaining: number;
}

export function makeCartKey(productId: string, seasoning: string): string {
  return `${productId}__${seasoning}`;
}

export function generateArabicOrderRef(): string {
  return toAr(Math.floor(1000 + Math.random() * 9000));
}

export function getCartSummary(cart: Record<string, CartLine>, items: StoreItem[]): CartSummary {
  const lines = Object.values(cart);
  const count = lines.reduce((total, line) => total + line.qty, 0);
  const subtotal = lines.reduce((total, line) => {
    const item = items.find((product) => product.id === line.productId);
    return total + (item ? item.price * line.qty : 0);
  }, 0);
  const fee = subtotal === 0 || subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + fee;
  const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_MIN) * 100));
  const remaining = Math.max(0, FREE_DELIVERY_MIN - subtotal);

  return { lines, count, subtotal, fee, grandTotal, pct, remaining };
}

export function buildWhatsAppOrderText(
  cart: Record<string, CartLine>,
  items: StoreItem[],
  delivery: DeliveryDetails,
  orderRef: string,
): string {
  const summary = getCartSummary(cart, items);
  const day = DELIVERY_DAYS.find((entry) => entry.id === delivery.dayId) ?? DELIVERY_DAYS[0];
  const window = DELIVERY_WINDOWS.find((entry) => entry.id === delivery.windowId) ?? DELIVERY_WINDOWS[1];
  const output = [
    '*طلب شوي جديد — متجر جمر | JAMR*',
    `رقم المرجع: #جمر-${toAr(orderRef)}`,
    '────────────────────',
    '*بيانات العميل والتوصيل:*',
    `• الاسم: ${toAr(delivery.customerName || '(الاسم لم يُحدد)')}`,
  ];

  if (delivery.customerPhone) output.push(`• الجوال: ${toAr(delivery.customerPhone)}`);

  output.push(
    `• المدينة والحي: الرياض — ${toAr(delivery.neighborhood || '(الحي لم يُحدد)')}`,
    `• موعد التوصيل المبرد: ${toAr(day.label)} (${toAr(window.label)})`,
  );
  if (delivery.notes) output.push(`• ملاحظات إضافية: ${toAr(delivery.notes)}`);

  output.push('────────────────────', '*الأصناف المطلوبة (جاهزة للشوي):*');
  summary.lines.forEach((line, index) => {
    const product = items.find((entry) => entry.id === line.productId);
    if (!product) return;
    output.push(
      `${toAr(index + 1)}. *${toAr(product.name)}* (الكمية: ${toAr(line.qty)}) — ${toAr(product.price * line.qty)} ر.س`,
      `   - التجهيز: ${toAr(line.seasoning)}`,
    );
  });

  output.push(
    '────────────────────',
    `• المجموع الفرعي: ${toAr(summary.subtotal)} ر.س`,
    `• التوصيل المبرد بالرياض: ${summary.fee === 0 ? `مجاني (${toAr(0)} ر.س)` : `${toAr(summary.fee)} ر.س`}`,
    `*الإجمالي النهائي: ${toAr(summary.grandTotal)} ر.س*`,
    '────────────────────',
    'نرجو تأكيد الطلب، وسأشارككم موقع التوصيل الدقيق.',
  );

  return toAr(output.join('\n'));
}
