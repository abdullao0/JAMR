import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { Icon } from './components/Icon';
import { CartLineCard, ProductCard, ProductQuickView, UpsellCard } from './components/Storefront';
import { CATEGORIES, DELIVERY_DAYS, DELIVERY_FEE, DELIVERY_WINDOWS, FREE_DELIVERY_MIN, GATHERING_BOXES, INDIVIDUAL_TRAYS, RIYADH_DISTRICTS, SEASONING_CHOICES, WHATSAPP_PHONE, ALL_ITEMS, type CategoryId, type Protein as ProteinFilter } from './data/store';
import { ICON_PATHS, type IconName } from './data/icons';
import { buildWhatsAppOrderText, generateArabicOrderRef, getCartSummary, makeCartKey, toAr, type DeliveryDetails } from './storeLogic';
import type { CartLine, StoreItem } from './types';

const DEFAULT_BOX_SEASONING = 'تتبيلة جمر المعتمدة للبوكس';
const DEFAULT_TRAY_SEASONING = 'تحضير طازج معتمد';
const FORM_ERROR = 'يرجى إدخال الاسم الكريم والحي في الرياض لإرسال الطلب.';

function itemPassesFilter(
  item: StoreItem,
  activeCategory: CategoryId,
  proteinFilter: ProteinFilter,
  searchQuery: string,
): boolean {
  if (activeCategory !== 'all' && item.category !== activeCategory) return false;
  if (proteinFilter !== 'all' && item.protein !== 'all' && item.protein !== proteinFilter) return false;
  if (searchQuery) {
    const text = `${item.name} ${item.summary} ${item.type === 'box' ? item.contentsPills.join(' ') : ''}`.toLowerCase();
    if (!text.includes(searchQuery)) return false;
  }
  return true;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [proteinFilter, setProteinFilter] = useState<ProteinFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [cardSeasoning, setCardSeasoning] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      INDIVIDUAL_TRAYS.filter((item) => item.customizableSeasoning).map((item) => [item.id, SEASONING_CHOICES[0]]),
    ),
  );
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    dayId: 'thursday',
    windowId: 'slot2',
    neighborhood: 'حي الملقا',
    customerName: '',
    customerPhone: '',
    notes: '',
  });
  const [customerDistrict, setCustomerDistrict] = useState('حي الملقا');
  const [modalTempDay, setModalTempDay] = useState('thursday');
  const [modalTempWindow, setModalTempWindow] = useState('slot2');
  const [modalNeighborhood, setModalNeighborhood] = useState('حي الملقا');
  const [slotOpen, setSlotOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [invoicePreviewExpanded, setInvoicePreviewExpanded] = useState(false);
  const [formError, setFormError] = useState('');
  const [orderRef, setOrderRef] = useState(generateArabicOrderRef);
  const [whatsAppHref, setWhatsAppHref] = useState('#');
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState<IconName | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchQuery = searchInput.trim().toLowerCase();
  const visibleBoxes = useMemo(
    () => GATHERING_BOXES.filter((item) => itemPassesFilter(item, activeCategory, proteinFilter, searchQuery)),
    [activeCategory, proteinFilter, searchQuery],
  );
  const visibleTrays = useMemo(
    () => INDIVIDUAL_TRAYS.filter((item) => itemPassesFilter(item, activeCategory, proteinFilter, searchQuery)),
    [activeCategory, proteinFilter, searchQuery],
  );
  const cartSummary = useMemo(() => getCartSummary(cart, ALL_ITEMS), [cart]);
  const cartLines = cartSummary.lines;
  const invoiceText = useMemo(
    () => buildWhatsAppOrderText(cart, ALL_ITEMS, delivery, orderRef),
    [cart, delivery, orderRef],
  );
  const selectedProduct = productId ? ALL_ITEMS.find((item) => item.id === productId) ?? null : null;
  const selectedSeasoning = selectedProduct?.type === 'box'
    ? DEFAULT_BOX_SEASONING
    : selectedProduct?.type === 'tray' && selectedProduct.customizableSeasoning
      ? cardSeasoning[selectedProduct.id]
      : DEFAULT_TRAY_SEASONING;
  const selectedDay = DELIVERY_DAYS.find((day) => day.id === delivery.dayId) ?? DELIVERY_DAYS[0];
  const selectedWindow = DELIVERY_WINDOWS.find((window) => window.id === delivery.windowId) ?? DELIVERY_WINDOWS[1];
  const deliverySlotLabel = `${selectedDay.label} • ${selectedWindow.label}`;
  const mobileSlotLabel = `${selectedDay.label.split('—')[0].trim()} • ${selectedWindow.shortLabel}`;
  const themeIcon = <Icon name={darkMode ? 'sun' : 'flame'} className="h-4 w-4 sm:h-5 sm:w-5" />;
  const formAlertClass = formError
    ? 'flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 p-2.5 text-xs font-bold text-red-700 dark:text-red-400'
    : 'hidden items-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 p-2.5 text-xs font-bold text-red-700 dark:text-red-400';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  function showToast(message: string, icon: IconName = 'flame') {
    setToastMessage(message);
    setToastIcon(icon);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastMessage('');
      setToastIcon(null);
    }, 2500);
  }

  function jumpToCategory(category: CategoryId) {
    setActiveCategory(category);
    document.getElementById('catalogStickyBar')?.scrollIntoView({ behavior: 'smooth' });
  }

  function jumpToTraysSection() {
    setActiveCategory('all');
    document.getElementById('traysSection')?.scrollIntoView({ behavior: 'smooth' });
  }

  function resetAllFilters() {
    setActiveCategory('all');
    setProteinFilter('all');
    setSearchInput('');
  }

  function setTraySeasoning(trayId: string, seasoning: string) {
    setCardSeasoning((current) => ({ ...current, [trayId]: seasoning }));
  }

  function openSlotModal() {
    setModalTempDay(delivery.dayId);
    setModalTempWindow(delivery.windowId);
    setModalNeighborhood(delivery.neighborhood);
    setSlotOpen(true);
  }

  function closeSlotModal() {
    setSlotOpen(false);
  }

  function openProductModal(id: string) {
    if (ALL_ITEMS.some((item) => item.id === id)) setProductId(id);
  }

  function closeProductModal() {
    setProductId(null);
  }

  function openCartDrawer() {
    setCartOpen(true);
  }

  function closeCartDrawer() {
    setCartOpen(false);
  }

  function closeWaDispatchModal() {
    setDispatchOpen(false);
  }

  function toggleInvoicePreview() {
    setInvoicePreviewExpanded((current) => !current);
  }

  function confirmSlotModal() {
    const newNeighborhood = toAr(modalNeighborhood.trim());
    setDelivery((current) => ({
      ...current,
      dayId: modalTempDay,
      windowId: modalTempWindow,
      neighborhood: newNeighborhood || current.neighborhood,
    }));
    setCustomerDistrict((current) =>
      newNeighborhood && (!current || RIYADH_DISTRICTS.includes(current) || current === delivery.neighborhood)
        ? newNeighborhood
        : current,
    );
    setSlotOpen(false);
    showToast('تم حفظ موعد التوصيل المبرد بالرياض', 'snowflake');
  }

  function adjustCartItem(id: string, seasoning: string, delta: number) {
    const item = ALL_ITEMS.find((entry) => entry.id === id);
    if (!item) return;

    const key = makeCartKey(id, seasoning);
    setCart((current) => {
      const existing = current[key];
      if (!existing && delta <= 0) return current;
      const nextQty = (existing?.qty ?? 0) + delta;
      const next = { ...current };
      if (nextQty <= 0) {
        delete next[key];
      } else {
        next[key] = { key, productId: id, seasoning, qty: nextQty };
      }
      return next;
    });
    if (delta > 0) showToast(`تمت إضافة «${item.name}» إلى السلة`, 'check');
  }

  function deleteCartLine(key: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    showToast(next ? 'تم تفعيل وضع المدخنة الليلي' : 'تم تفعيل وضع الجزارة النهاري', next ? 'flame' : 'sun');
  }

  async function copyInvoiceToClipboard() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is not available in this browser context.');
      }
      await navigator.clipboard.writeText(invoiceText);
      showToast('تم نسخ تفاصيل الطلب إلى الحافظة', 'copy');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = invoiceText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(
        copied ? 'تم نسخ تفاصيل الطلب إلى الحافظة' : 'يرجى تحديد النص ونسخه يدوياً',
        copied ? 'copy' : 'info',
      );
    }
  }

  function submitWhatsAppOrder() {
    if (!delivery.customerName.trim() || !customerDistrict.trim()) {
      setFormError(FORM_ERROR);
      document.getElementById('orderCustName')?.focus();
      showToast('يرجى تعبئة الاسم الكريم والحي في الرياض أولاً', 'info');
      return;
    }

    const nextOrderRef = generateArabicOrderRef();
    const nextDelivery = { ...delivery, neighborhood: customerDistrict };
    const message = buildWhatsAppOrderText(cart, ALL_ITEMS, nextDelivery, nextOrderRef);
    const href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    setDelivery(nextDelivery);
    setOrderRef(nextOrderRef);
    setWhatsAppHref(href);
    setDispatchOpen(true);
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    const parent = image.parentElement;
    image.style.display = 'none';
    if (!parent || parent.querySelector('[data-image-fallback]')) return;

    const fallback = document.createElement('div');
    fallback.dataset.imageFallback = 'true';
    fallback.className = 'img-fallback-surface flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#F5EFE6]';
    fallback.innerHTML = `<span class="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E05A2B]"><svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS.flame}</svg></span><span class="font-heading text-xs font-bold opacity-90">جمر — ملحمة الشوي المختصة</span>`;
    parent.insertBefore(fallback, image);
  }

  const categoryNav = CATEGORIES.map((category) => {
    const active = activeCategory === category.id;
    const count = category.id === 'all'
      ? ALL_ITEMS.length
      : category.id === 'boxes'
        ? GATHERING_BOXES.length
        : INDIVIDUAL_TRAYS.filter((item) => item.category === category.id).length;
    return (
      <button
        key={category.id}
        onClick={() => setActiveCategory(category.id)}
        type="button"
        className={`shrink-0 flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-extrabold transition-all sm:text-sm ${
          active
            ? 'bg-accent border-transparent text-white shadow-ember'
            : 'surface-card border-token text-token-primary hover:border-token-strong'
        }`}
      >
        <Icon name={category.icon} className="h-4 w-4" />
        <span className="whitespace-nowrap">{category.name}</span>
        <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'surface-secondary text-token-muted'}`}>
          {toAr(count)}
        </span>
      </button>
    );
  });
  const boxCards = visibleBoxes.map((item) => (
    <ProductCard
      key={item.id}
      item={item}
      qty={cart[makeCartKey(item.id, DEFAULT_BOX_SEASONING)]?.qty ?? 0}
      selectedSeasoning={DEFAULT_BOX_SEASONING}
      onOpen={setProductId}
      onAdjust={adjustCartItem}
      onSeasoningChange={setTraySeasoning}
    />
  ));
  const trayCards = visibleTrays.map((item) => {
    const seasoning = item.customizableSeasoning ? cardSeasoning[item.id] : DEFAULT_TRAY_SEASONING;
    return (
      <ProductCard
        key={item.id}
        item={item}
        qty={cart[makeCartKey(item.id, seasoning)]?.qty ?? 0}
        selectedSeasoning={seasoning}
        onOpen={setProductId}
        onAdjust={adjustCartItem}
        onSeasoningChange={setTraySeasoning}
      />
    );
  });
  const deliveryDayButtons = DELIVERY_DAYS.map((day) => {
    const active = modalTempDay === day.id;
    return (
      <button
        key={day.id}
        onClick={() => setModalTempDay(day.id)}
        type="button"
        className={`rounded-2xl border p-3 text-right transition ${
          active ? 'bg-accent border-transparent text-white shadow-ember' : 'surface-secondary border-token text-token-primary'
        }`}
      >
        <span className="block text-xs font-extrabold sm:text-sm">{day.label}</span>
        <span className={`mt-0.5 block text-[10px] sm:text-[11px] ${active ? 'text-white/85' : 'text-token-muted'}`}>{day.note}</span>
      </button>
    );
  });
  const deliveryWindowButtons = DELIVERY_WINDOWS.map((window) => {
    const active = modalTempWindow === window.id;
    return (
      <button
        key={window.id}
        onClick={() => setModalTempWindow(window.id)}
        type="button"
        className={`flex items-center justify-between gap-2 rounded-2xl border p-3 text-right transition ${
          active ? 'bg-accent border-transparent text-white shadow-ember' : 'surface-secondary border-token text-token-primary'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span><Icon name="clock" className="h-4 w-4" /></span>
          <div>
            <span className="block text-xs font-extrabold sm:text-sm">{window.label}</span>
            <span className={`block text-[11px] ${active ? 'text-white/85' : 'text-token-muted'}`}>{window.desc}</span>
          </div>
        </div>
        {active && <Icon name="check" className="h-4 w-4" />}
      </button>
    );
  });
  const districtChips = RIYADH_DISTRICTS.map((district) => {
    const selected = modalNeighborhood === district;
    return (
      <button
        key={district}
        onClick={() => setModalNeighborhood(district)}
        type="button"
        className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition ${
          selected
            ? 'bg-accent-soft border-current text-accent'
            : 'surface-secondary border-token text-token-muted hover:text-token-primary'
        }`}
      >
        {district}
      </button>
    );
  });
  const cartLineCards = cartLines.flatMap((line) => {
    const product = ALL_ITEMS.find((item) => item.id === line.productId);
    return product
      ? [<CartLineCard key={line.key} line={line} product={product} onDelete={deleteCartLine} onAdjust={adjustCartItem} />]
      : [];
  });
  const inCartIds = new Set(cartLines.map((line) => line.productId));
  const upsellCards = INDIVIDUAL_TRAYS
    .filter((item) => item.category === 'sauces' && !inCartIds.has(item.id))
    .map((item) => <UpsellCard key={item.id} item={item} onAdd={adjustCartItem} />);

  return (
    <>






<header id="siteHeader" className="sticky top-0 z-40 surface-glass border-b border-token transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">


      <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">


        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-accent text-white flex items-center justify-center shadow-ember transition-transform duration-300 group-hover:scale-105">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-heading text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-token-primary">جمر</span>
              <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.2em] text-accent uppercase">JAMR</span>
            </div>
            <p className="text-[10px] sm:text-xs text-token-muted font-body -mt-1 hidden xs:block">ملحمة الشوي المختصة • الرياض</p>
          </div>
        </a>


        <button onClick={openSlotModal} type="button" className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl surface-card border border-token hover:border-token-strong text-right transition-all duration-200 group max-w-md lg:max-w-lg">
          <span className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path>
            </svg>
          </span>
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-token-muted font-body">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 live-pulse shrink-0"></span>
              <span className="truncate">الرياض • <span id="desktopNeighborhoodText" className="font-bold text-token-primary">{delivery.neighborhood}</span> • توصيل مبرد</span>
            </div>
            <div className="text-xs lg:text-sm font-bold text-token-primary flex items-center gap-1.5 mt-0.5">
              <span id="desktopSlotText" className="truncate">{deliverySlotLabel}</span>
              <svg className="w-4 h-4 text-accent shrink-0 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>
          </div>
        </button>


        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          <button id="themeToggleBtn" onClick={toggleTheme} type="button" aria-label="تبديل المظهر بين النهاري والليلي" className="flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl surface-card border border-token hover:border-token-strong active:scale-95 transition-all text-xs font-bold text-token-primary">
            <span id="themeIconWrap" className="text-accent flex items-center justify-center">{themeIcon}</span>
            <span id="themeLabelText" className="hidden xl:inline">{darkMode ? 'وضع الجزارة' : 'وضع المدخنة'}</span>
          </button>


          <button onClick={openCartDrawer} type="button" aria-label="فتح سلة الشوي" className="flex items-center gap-2 sm:gap-2.5 h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-accent text-white font-bold shadow-ember hover:opacity-95 active:scale-95 transition-all">
            <div className="relative flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span id="headerCartBadge" className="absolute -top-2 -right-2 min-w-[19px] h-[19px] px-1 rounded-full bg-white text-[#8B261D] dark:text-[#12100E] text-[11px] font-black inline-flex items-center justify-center shadow">{toAr(cartSummary.count)}</span>
            </div>
            <div className="text-right leading-tight">
              <span className="hidden sm:block text-[10px] opacity-85 font-body">سلة الشوي</span>
              <span id="headerCartTotal" className="text-xs sm:text-sm font-extrabold whitespace-nowrap">{`${toAr(cartSummary.subtotal)} ر.س`}</span>
            </div>
          </button>
        </div>

      </div>


      <div className="md:hidden pb-2.5">
        <button onClick={openSlotModal} type="button" className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl surface-card border border-token text-[11px] xs:text-xs active:scale-[0.99] transition">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-accent shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path>
              </svg>
            </span>
            <span className="text-token-muted shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span className="font-bold text-token-primary truncate">
              الرياض • <span id="mobileNeighborhoodText">{delivery.neighborhood}</span>
            </span>
            <span className="text-token-muted">•</span>
            <span className="text-accent font-bold truncate flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span id="mobileSlotText" className="truncate">{mobileSlotLabel}</span>
            </span>
          </div>
          <span className="text-accent shrink-0 flex items-center gap-0.5 font-extrabold">
            <span className="hidden xs:inline">تغيير</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </span>
        </button>
      </div>

    </div>
  </header>






<section className="relative pt-5 pb-8 sm:pt-8 sm:pb-12 craft-dots">
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">


        <div className="lg:col-span-7 surface-card border border-token rounded-3xl p-5 sm:p-8 lg:p-11 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-accent opacity-10 blur-3xl pointer-events-none"></div>

          <div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft text-accent text-xs sm:text-sm font-bold mb-5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
              <span>جاهز للشوي في الرياض • تحضير يومي طازج</span>
            </div>


            <h1 className="font-heading hero-title font-black text-token-primary mb-4">
              لحمك مقطّع ومتبّل وجاهز للجمر..<br />
              <span className="text-accent">يوصلك مبرد لباب البيت أو الاستراحة</span>
            </h1>


            <p className="font-body text-sm sm:text-base lg:text-lg text-token-muted leading-relaxed max-w-2xl mb-7">
              نختار لك يومياً أطيب قطعيات البلاك أنجوس، الواغيو، والغنم النعيمي الطازج والدجاج المبرد. نجهزها في بوكسات جمعات مدروسة أو صحون فردية حسب ذوقك، ونوصلها بأسطول مبرد داخل الرياض ومخيمات الثمامة والعمارية.
            </p>
          </div>

          <div>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mb-7">
              <button onClick={() => jumpToCategory('boxes')} type="button" className="px-6 py-3.5 sm:py-4 rounded-2xl bg-accent text-white font-extrabold text-sm sm:text-base shadow-ember hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path>
                </svg>
                <span>تصفح بوكسات الجمعات</span>
              </button>

              <button onClick={jumpToTraysSection} type="button" className="px-6 py-3.5 sm:py-4 rounded-2xl surface-secondary text-token-primary border border-token-strong font-extrabold text-sm sm:text-base hover:border-current active:scale-[0.99] transition flex items-center justify-center gap-2.5">
                <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 2 10 5-10 5L2 7l10-5Z"></path><path d="m2 12 10 5 10-5"></path><path d="m2 17 10 5 10-5"></path>
                </svg>
                <span>اختر صحونك بنفسك</span>
              </button>
            </div>


            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-5 border-t border-token">
              <div>
                <span className="block font-heading text-lg sm:text-2xl font-black text-token-primary">١٠٠٪</span>
                <span className="text-[11px] sm:text-xs text-token-muted font-body">لحوم مبردة غير مجمدة</span>
              </div>
              <div>
                <span className="block font-heading text-lg sm:text-2xl font-black text-accent">٠ – ٤°م</span>
                <span className="text-[11px] sm:text-xs text-token-muted font-body">نقل مبرد لباب موقعك</span>
              </div>
              <div>
                <span className="block font-heading text-lg sm:text-2xl font-black text-token-primary">+٣٥٠ ر.س</span>
                <span className="text-[11px] sm:text-xs text-token-muted font-body">توصيل مجاني بالرياض</span>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[400px] rounded-3xl overflow-hidden border border-token img-fallback-surface group">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=85" onError={handleImageError} alt="تشكيلة لحوم جمر الجاهزة للشوي في الرياض" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>


          <div className="absolute top-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 border border-white/15 text-[11px] sm:text-xs font-bold">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path>
              </svg>
              <span>ضمان التبريد ٠ – ٤°م</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#1E1B18] text-[11px] sm:text-xs font-extrabold shadow">
              <svg className="w-3.5 h-3.5 text-[#8B261D] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>درجة تعريق رخامي فاخرة</span>
            </span>
          </div>


          <div className="absolute bottom-4 right-4 left-4 p-4 sm:p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold mb-1">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                  <span>الأكثر طلباً لجمعات الخميس والجمعة</span>
                </div>
                <h2 className="font-heading text-sm sm:text-lg font-extrabold truncate">بوكس الاستراحة الملكي (يكفي ١٠ – ١٢ شخص)</h2>
                <p className="text-xs text-stone-300 font-body mt-0.5 truncate">٥.٨ كجم • ستيك ريب آي + ٣٤ سيخ + ١٢ برجر واغيو</p>
              </div>
              <button onClick={() => openProductModal('box-istiraha-royal')} type="button" className="shrink-0 px-3.5 py-2.5 rounded-xl bg-[#E05A2B] hover:bg-[#C94B1F] text-white text-xs font-extrabold transition flex items-center gap-1.5">
                <span>التفاصيل</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 mt-5">
        <div className="surface-card border border-token rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-token-primary">تحضير وتتبيل يومي طازج</h3>
            <p className="text-xs text-token-muted font-body mt-0.5 leading-relaxed">تقطيع وشكّ الأسياخ يوم استلامك بأطباق محكمة تحفظ العصارة</p>
          </div>
        </div>

        <div className="surface-card border border-token rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
              <path d="M15 18H9"></path>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
              <circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle>
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-token-primary">أسطول توصيل مبرد بالرياض</h3>
            <p className="text-xs text-token-muted font-body mt-0.5 leading-relaxed">نوافذ توصيل مجدولة تغطي أحياء الرياض واستراحات الثمامة والعمارية</p>
          </div>
        </div>

        <div className="surface-card border border-token rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-token-primary">طلب فوري عبر واتساب بدون تعقيد</h3>
            <p className="text-xs text-token-muted font-body mt-0.5 leading-relaxed">اختر أصنافك وحدد موعدك وأرسل الفاتورة الجاهزة بضغطة واحدة</p>
          </div>
        </div>
      </div>

    </div>
  </section>






<div id="catalogStickyBar" className="sticky top-[104px] md:top-20 z-30 surface-glass border-y border-token py-3 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">


        <nav id="categoryFilterNav" aria-label="أقسام الملحمة" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5" data-slot="categoryFilterNav">{categoryNav}</nav>


        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 sm:w-56">
            <input id="searchCatalogInput" type="search" onChange={(event) => setSearchInput(event.currentTarget.value)} value={searchInput} placeholder="ابحث عن أوصال، ريب آي، كشتة..." className="w-full pr-9 pl-3 py-2 rounded-xl surface-card border border-token text-xs font-bold text-token-primary placeholder:text-token-muted placeholder:font-normal focus:outline-none focus:border-current" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-token-muted pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
              </svg>
            </span>
          </div>

          <select id="proteinSelect" onChange={(event) => setProteinFilter(event.currentTarget.value as ProteinFilter)} aria-label="تصفية حسب نوع البروتين" className="px-3 py-2 rounded-xl surface-card border border-token text-xs font-bold text-token-primary focus:outline-none cursor-pointer" value={proteinFilter}>
            <option value="all">كل اللحوم</option>
            <option value="beef">بقري أنجوس وواغيو</option>
            <option value="lamb">غنم نعيمي بلدي</option>
            <option value="chicken">دجاج محلي مبرد</option>
            <option value="mixed">تشكيلة متنوعة</option>
          </select>
        </div>

      </div>
    </div>
  </div>






<main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-11 space-y-12 sm:space-y-16 pb-28 md:pb-16">


    <div id="emptyCatalogState" className={visibleBoxes.length || visibleTrays.length ? "hidden surface-card border border-token rounded-3xl p-10 sm:p-14 text-center" : "surface-card border border-token rounded-3xl p-10 sm:p-14 text-center"}>
      <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent mx-auto flex items-center justify-center mb-4">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      <h3 className="font-heading text-lg sm:text-xl font-extrabold text-token-primary mb-2">لم نجد أصنافاً تطابق خيارات التصفية</h3>
      <p className="text-xs sm:text-sm text-token-muted font-body mb-5">جرّب مسح البحث لاستعراض كافة بوكسات الجمعات وصحون جمر الطازجة.</p>
      <button onClick={resetAllFilters} type="button" className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs sm:text-sm font-extrabold shadow-ember">
        عرض القائمة الكاملة
      </button>
    </div>


    <section id="boxesSection" className={visibleBoxes.length ? "space-y-5 sm:space-y-6" : "hidden space-y-5 sm:space-y-6"}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-accent mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path>
            </svg>
            <span>مرتبة ومغلفة وجاهزة للمنقل • شاملة الصوصات</span>
          </div>
          <h2 className="font-heading section-title font-black text-token-primary">بوكسات الجمعات والكشتات</h2>
        </div>
        <p className="text-xs sm:text-sm text-token-muted font-body">
          كميات موزونة بدقة لتكفي ضيوفك في البيت أو الاستراحة أو المخيم
        </p>
      </div>


      <div id="boxesGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" data-slot="boxesGrid">{boxCards}</div>
    </section>


    <section id="traysSection" className={visibleTrays.length ? "space-y-5 sm:space-y-6 pt-4 border-t border-token" : "hidden space-y-5 sm:space-y-6 pt-4 border-t border-token"}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gold mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 2 10 5-10 5L2 7l10-5Z"></path><path d="m2 12 10 5 10-5"></path><path d="m2 17 10 5 10-5"></path>
            </svg>
            <span>تخصيص التتبيلة متاح لكل صحن لحم</span>
          </div>
          <h2 id="traysSectionHeading" className="font-heading section-title font-black text-token-primary">
            {activeCategory === 'all' ? 'الصحون والأطباق الفردية' : CATEGORIES.find((category) => category.id === activeCategory)?.name}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-token-muted font-body">
          اختر بين «تتبيلة جمر الخاصة» أو «ملح وفلفل فقط» مباشرة قبل الإضافة للسلة
        </p>
      </div>


      <div id="traysGrid" className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5" data-slot="traysGrid">{trayCards}</div>
    </section>


    <section className="surface-card border border-token rounded-3xl p-5 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-extrabold">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 22 4-10 4 10"></path>
            </svg>
            <span>قاعدة الجمر الذهبية من ملحمة جمر</span>
          </div>
          <h3 className="font-heading text-lg sm:text-2xl font-black text-token-primary">كيف تحصل على شوي طري وعصاري بنسبة ١٠٠٪؟</h3>
          <p className="text-xs sm:text-base text-token-muted font-body leading-relaxed">
            أخرج صحون اللحم من التبريد قبل وضعها على الشبك بـ ٢٠ دقيقة، وانتظر حتى يهدأ لهب الفحم تماماً وتظهر طبقة رماد بيضاء خفيفة فوق الجمر. كل صحن يوصلك مرفقاً بإرشاد دقائق الشوي المثالية لكل وجه.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-bold text-token-primary">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl surface-secondary border border-token">
              <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path>
              </svg>
              <span>درجة حفظ ٠ – ٤°م</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl surface-secondary border border-token">
              <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>طازج للشوي خلال ٤٨ ساعة</span>
            </span>
          </div>
        </div>
        <div className="lg:col-span-4 flex lg:justify-end">
          <button onClick={openSlotModal} type="button" className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-accent text-white font-extrabold text-xs sm:text-sm shadow-ember hover:opacity-95 transition flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span>تحديد نافذة التوصيل المبرد بالرياض</span>
          </button>
        </div>
      </div>
    </section>

  </main>






<footer className="surface-secondary border-t border-token pt-10 pb-28 md:pb-12">
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-token">

        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
              </svg>
            </div>
            <div>
              <span className="font-heading text-lg font-black text-token-primary">جمر | JAMR</span>
              <span className="block text-xs text-token-muted">ملحمة الشوي المختصة • الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-token-muted font-body leading-relaxed">
            نقدّم تجربة شوي راقية وجاهزة بدون عناء التقطيع والتتبيل، مع التزام صارم بمعايير النظافة وسلسلة التبريد من الملحمة حتى موقعك في الرياض.
          </p>
        </div>

        <div className="md:col-span-4 space-y-2">
          <h4 className="font-heading font-extrabold text-sm text-token-primary">تغطية التوصيل المبرد بالرياض</h4>
          <p className="text-xs text-token-muted font-body leading-relaxed">
            الملقا، الياسمين، النرجس، حطين، الصحافة، العقيق، العليا، قرطبة، السفارات، بالإضافة إلى استراحات ومخيمات الرمال والثمامة والعمارية والدرعية.
          </p>
          <p className="text-xs font-extrabold text-accent pt-1">
            رسوم التوصيل المبرد ٢٥ ر.س • ومجاني للطلبات فوق ٣٥٠ ر.س
          </p>
        </div>

        <div className="md:col-span-3 space-y-2">
          <h4 className="font-heading font-extrabold text-sm text-token-primary">الأقسام السريعة</h4>
          <ul className="space-y-1.5 text-xs text-token-muted font-bold">
            <li><button onClick={() => jumpToCategory('boxes')} type="button" className="hover:text-accent transition">بوكسات الجمعات</button></li>
            <li><button onClick={() => jumpToCategory('skewers')} type="button" className="hover:text-accent transition">أوصال وشيش وكباب</button></li>
            <li><button onClick={() => jumpToCategory('steaks')} type="button" className="hover:text-accent transition">ستيك وأضلاع</button></li>
            <li><button onClick={openSlotModal} type="button" className="hover:text-accent transition">جدولة موعد التوصيل</button></li>
            <li><button onClick={openCartDrawer} type="button" className="hover:text-accent transition">مراجعة السلة وإرسال واتساب</button></li>
          </ul>
        </div>

      </div>

      <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-token-muted">
        <p>© ٢٠٢٦ متجر جمر للشوي الجاهز (JAMR). جميع الحقوق محفوظة — الرياض.</p>
        <p>تُحفظ كافة الأصناف مبردة بين ٠ – ٤°م وتُشوى خلال ٤٨ ساعة</p>
      </div>
    </div>
  </footer>






<div id="mobileBottomCartBar" className={cartLines.length ? "md:hidden fixed bottom-3 inset-x-3 z-30 transition-all duration-300" : "md:hidden fixed bottom-3 inset-x-3 z-30 hidden transition-all duration-300"}>
    <div className="surface-card border-2 border-token-strong rounded-2xl p-3 shadow-2xl">
      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 px-0.5">
        <span id="mobileBarDeliveryHint" className="text-token-primary truncate">{cartSummary.remaining === 0 ? 'طلبك مؤهل للتوصيل المبرد المجاني بالرياض' : `أضف بقيمة ${toAr(cartSummary.remaining)} ر.س للتوصيل المبرد المجاني`}</span>
        <span id="mobileBarDeliveryPct" className="text-accent font-extrabold shrink-0">{`${toAr(cartSummary.pct)}٪`}</span>
      </div>
      <div className="w-full h-1.5 rounded-full surface-secondary overflow-hidden mb-2.5">
        <div id="mobileBarProgressFill" className="h-full bg-accent transition-all duration-500 rounded-full" style={{ width: `${cartSummary.pct}%` }}></div>
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span id="mobileBarCountBadge" className="w-9 h-9 rounded-xl bg-accent-soft text-accent font-heading font-black text-sm flex items-center justify-center shrink-0">{toAr(cartSummary.count)}</span>
          <div className="leading-tight min-w-0">
            <span className="block text-[10px] text-token-muted font-body">الإجمالي التقديري</span>
            <span id="mobileBarTotal" className="font-heading text-sm font-black text-token-primary truncate">{`${toAr(cartSummary.grandTotal)} ر.س`}</span>
          </div>
        </div>

        <button onClick={openCartDrawer} type="button" className="px-4 py-2.5 rounded-xl bg-[#1E8E4E] hover:bg-[#187740] text-white font-extrabold text-xs shadow transition flex items-center gap-1.5 shrink-0">
          <span>عرض السلة وإرسال الطلب</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>






<div id="slotModal" onClick={(event) => { if (event.target === event.currentTarget) closeSlotModal(); }} className={slotOpen ? "fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/65 backdrop-blur-sm" : "hidden fixed inset-0 z-50 items-end sm:items-center justify-center sm:p-4 bg-black/65 backdrop-blur-sm"}>
    <div className="surface-card border border-token rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-sheet flex flex-col overflow-hidden shadow-2xl">

      <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
        <span className="w-10 h-1 rounded-full bg-stone-400/40"></span>
      </div>

      <div className="px-5 py-4 border-b border-token flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
          </span>
          <div>
            <span className="text-[11px] font-bold text-accent block">خدمة النقل المبرد • الرياض</span>
            <h3 className="font-heading text-base sm:text-lg font-black text-token-primary">تحديد موعد وحي الاستلام</h3>
          </div>
        </div>
        <button onClick={closeSlotModal} type="button" aria-label="إغلاق" className="w-9 h-9 rounded-xl surface-secondary text-token-primary flex items-center justify-center hover:opacity-80">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div className="p-5 overflow-y-auto space-y-5 flex-1">

        <div>
          <label className="block text-xs font-extrabold text-token-primary mb-2">١. اختر يوم التوصيل</label>
          <div id="slotDayGrid" className="grid grid-cols-2 gap-2.5" data-slot="slotDayGrid">{deliveryDayButtons}</div>
        </div>


        <div>
          <label className="block text-xs font-extrabold text-token-primary mb-2">٢. اختر الفترة الزمنية المبردة</label>
          <div id="slotWindowGrid" className="grid grid-cols-1 gap-2" data-slot="slotWindowGrid">{deliveryWindowButtons}</div>
        </div>


        <div>
          <label htmlFor="slotDistrictInput" className="block text-xs font-extrabold text-token-primary mb-2">٣. الحي في الرياض أو موقع الاستراحة</label>
          <input id="slotDistrictInput" type="text" onChange={(event) => setModalNeighborhood(toAr(event.currentTarget.value))} placeholder="اكتب الحي أو اختر من الأحياء بالأسفل..." className="w-full px-3.5 py-2.5 rounded-xl surface-secondary border border-token text-xs sm:text-sm font-bold text-token-primary focus:outline-none focus:border-current mb-2.5" value={modalNeighborhood} />
          <div id="slotDistrictChips" className="flex flex-wrap gap-1.5" data-slot="slotDistrictChips">{districtChips}</div>
        </div>
      </div>

      <div className="p-4 sm:p-5 border-t border-token surface-card shrink-0">
        <button onClick={confirmSlotModal} type="button" className="w-full py-3.5 rounded-2xl bg-accent text-white font-extrabold text-sm shadow-ember hover:opacity-95 transition flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          <span>اعتماد موعد التوصيل</span>
        </button>
      </div>
    </div>
  </div>






<div id="productQuickModal" onClick={(event) => { if (event.target === event.currentTarget) closeProductModal(); }} className={selectedProduct ? "fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm" : "hidden fixed inset-0 z-50 items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm"}>
    <div id="productQuickModalCard" className="surface-card border border-token rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-sheet flex flex-col overflow-hidden shadow-2xl" data-slot="productQuickModalCard">{selectedProduct ? <ProductQuickView item={selectedProduct} onClose={closeProductModal} onAdd={adjustCartItem} onSeasoningChange={setTraySeasoning} selectedSeasoning={selectedSeasoning} /> : null}</div>
  </div>






<div id="cartBackdrop" onClick={closeCartDrawer} className={cartOpen ? "fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity" : "hidden fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity"}></div>



<aside id="cartDrawer" aria-label="سلة الشوي وإتمام الطلب" className={cartOpen ? "fixed top-0 left-0 z-50 w-full sm:w-[440px] h-dvh-screen surface-card border-r border-token shadow-2xl transform transition-transform duration-300 flex flex-col" : "fixed top-0 left-0 z-50 w-full sm:w-[440px] h-dvh-screen surface-card border-r border-token shadow-2xl transform -translate-x-full transition-transform duration-300 flex flex-col"}>

    <div className="px-4 sm:px-5 py-4 border-b border-token flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </span>
        <div>
          <h2 className="font-heading text-base sm:text-lg font-black text-token-primary">سلة الشوي الخاصة بك</h2>
          <p id="drawerSubCount" className="text-[11px] text-token-muted font-body">{cartLines.length ? `${toAr(cartSummary.count)} أصناف مختارة للتجهيز الطازج` : 'توصيل مبرد داخل مدينة الرياض'}</p>
        </div>
      </div>
      <button onClick={closeCartDrawer} type="button" aria-label="إغلاق السلة" className="w-9 h-9 rounded-xl surface-secondary text-token-primary flex items-center justify-center hover:opacity-80">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>


    <div className="px-4 sm:px-5 py-3 surface-secondary border-b border-token shrink-0">
      <div className="flex items-center justify-between gap-2 text-xs font-bold mb-1.5">
        <span id="drawerFreeShipMsg" className="text-token-primary truncate">{cartSummary.subtotal === 0 ? `التوصيل المبرد مجاني للطلبات فوق ${toAr(FREE_DELIVERY_MIN)} ر.س` : cartSummary.remaining === 0 ? 'حصلت على توصيل مبرد مجاني داخل الرياض' : `متبقي ${toAr(cartSummary.remaining)} ر.س للحصول على توصيل مبرد مجاني`}</span>
        <span id="drawerFreeShipBadge" className="text-accent font-extrabold shrink-0">{cartSummary.remaining === 0 && cartSummary.subtotal > 0 ? 'مجاني' : `${toAr(DELIVERY_FEE)} ر.س`}</span>
      </div>
      <div className="w-full h-2 rounded-full surface-card overflow-hidden border border-token">
        <div id="drawerFreeShipFill" className="h-full bg-accent transition-all duration-500 rounded-full" style={{ width: `${cartSummary.pct}%` }}></div>
      </div>
    </div>


    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">


      <div id="drawerEmptyView" className={cartLines.length ? "hidden py-14 text-center space-y-4" : "py-14 text-center space-y-4"}>
        <div className="w-16 h-16 rounded-3xl bg-accent-soft text-accent mx-auto flex items-center justify-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h3 className="font-heading text-lg font-extrabold text-token-primary">سلتك خالية حالياً</h3>
        <p className="text-xs sm:text-sm text-token-muted font-body max-w-xs mx-auto leading-relaxed">
          اختر أحد بوكسات الجمعات المتكاملة أو أضف صحون الأوصال والستيك والبرجر الجاهزة للشوي.
        </p>
        <button onClick={() => { closeCartDrawer(); jumpToCategory('boxes'); }} type="button" className="px-5 py-3 rounded-xl bg-accent text-white text-xs font-extrabold shadow-ember inline-flex items-center gap-2">
          <span>استعراض بوكسات الجمعات</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
      </div>


      <div id="drawerFilledView" className={cartLines.length ? "space-y-5" : "hidden space-y-5"}>


        <div id="drawerCartItems" className="space-y-2.5" data-slot="drawerCartItems">{cartLineCards}</div>


        <div id="drawerUpsellWrap" className={upsellCards.length ? "pt-3 border-t border-token" : "hidden pt-3 border-t border-token"}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-token-primary">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
              <span>أضف لمسة جمر — صوصات وزبدة</span>
            </div>
            <span className="text-[11px] text-token-muted">إضافة فورية</span>
          </div>
          <div id="drawerUpsellList" className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1" data-slot="drawerUpsellList">{upsellCards}</div>
        </div>


        <div className="surface-secondary border border-token rounded-2xl p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-xs sm:text-sm font-extrabold text-token-primary flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>بيانات الاستلام في الرياض</span>
            </h4>
            <span className="text-[11px] text-accent font-bold">مباشر بدون تسجيل</span>
          </div>


          <div>
            <label htmlFor="orderCustName" className="block text-xs font-bold text-token-primary mb-1">الاسم الكريم *</label>
            <input id="orderCustName" type="text" onChange={(event) => { const customerName = toAr(event.currentTarget.value.trim()); setDelivery((current) => ({ ...current, customerName })); setFormError(''); }} placeholder="مثال: أبو فهد / سلطان العتيبي" className="w-full px-3.5 py-2.5 rounded-xl surface-card border border-token text-xs sm:text-sm font-bold text-token-primary focus:outline-none focus:border-current" value={delivery.customerName} />
          </div>


          <div>
            <label htmlFor="orderCustPhone" className="block text-xs font-bold text-token-primary mb-1">رقم الجوال للتواصل (اختياري)</label>
            <input id="orderCustPhone" type="tel" dir="rtl" onChange={(event) => { const customerPhone = toAr(event.currentTarget.value.trim()); setDelivery((current) => ({ ...current, customerPhone })); setFormError(''); }} placeholder="٠٥XXXXXXXX" className="w-full px-3.5 py-2.5 rounded-xl surface-card border border-token text-xs sm:text-sm font-bold text-token-primary focus:outline-none focus:border-current" value={delivery.customerPhone} />
          </div>


          <div>
            <label htmlFor="orderCustDistrict" className="block text-xs font-bold text-token-primary mb-1">الحي / وصف الموقع أو الاستراحة *</label>
            <input id="orderCustDistrict" type="text" list="riyadhNeighborhoodOptions" onChange={(event) => { const value = toAr(event.currentTarget.value.trim()); setCustomerDistrict(value); setDelivery((current) => ({ ...current, neighborhood: value })); setFormError(''); }} placeholder="مثال: حي الملقا، استراحة العمارية، مخيم الثمامة..." className="w-full px-3.5 py-2.5 rounded-xl surface-card border border-token text-xs sm:text-sm font-bold text-token-primary focus:outline-none focus:border-current" value={customerDistrict} />
            <datalist id="riyadhNeighborhoodOptions">
              <option value="حي الملقا"></option>
              <option value="حي الياسمين"></option>
              <option value="حي النرجس"></option>
              <option value="حي حطين"></option>
              <option value="حي الصحافة"></option>
              <option value="حي العليا"></option>
              <option value="الرمال / الثمامة"></option>
              <option value="العمارية / الدرعية"></option>
            </datalist>
          </div>


          <div className="p-3 rounded-xl surface-card border border-token flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="block text-[11px] text-token-muted font-body">موعد التوصيل المبرد المحدد</span>
              <span id="drawerSyncedSlotLabel" className="block text-xs font-extrabold text-token-primary truncate mt-0.5">{deliverySlotLabel}</span>
            </div>
            <button onClick={openSlotModal} type="button" className="shrink-0 px-2.5 py-1.5 rounded-lg bg-accent-soft text-accent text-[11px] font-extrabold hover:opacity-85 transition">
              تعديل الموعد
            </button>
          </div>


          <div>
            <label htmlFor="orderCustNotes" className="block text-xs font-bold text-token-muted mb-1">ملاحظات للملحمة أو المندوب (اختياري)</label>
            <input id="orderCustNotes" type="text" onChange={(event) => { const notes = toAr(event.currentTarget.value.trim()); setDelivery((current) => ({ ...current, notes })); setFormError(''); }} placeholder="مثال: تقليل الدهن، أو سأشارك موقع اللوكيشن بالمحادثة..." className="w-full px-3.5 py-2 rounded-xl surface-card border border-token text-xs text-token-primary focus:outline-none" value={delivery.notes} />
          </div>

          <div id="formValidationAlert" className={formAlertClass}>{formError && (<>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg><span>{formError}</span>
          </>)}</div>
        </div>


        <div className="border border-token rounded-2xl overflow-hidden">
          <button onClick={toggleInvoicePreview} type="button" className="w-full px-4 py-3 surface-secondary flex items-center justify-between text-xs font-extrabold text-token-primary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line>
              </svg>
              <span>معاينة فاتورة الطلب النصية</span>
            </span>
            <span id="invoicePreviewToggleLabel" className="text-accent flex items-center gap-1">{invoicePreviewExpanded ? <><span>إخفاء</span><Icon name="chevronDown" className="w-3.5 h-3.5 rotate-180" /></> : <><span>عرض</span><Icon name="chevronDown" className="w-3.5 h-3.5" /></>}</span>
          </button>

          <div id="invoicePreviewBody" className={invoicePreviewExpanded ? "p-3.5 surface-card space-y-2.5" : "hidden p-3.5 surface-card space-y-2.5"}>
            <pre id="invoicePreviewPre" className="text-[11px] leading-relaxed whitespace-pre-wrap font-body text-token-primary surface-secondary p-3 rounded-xl border border-token max-h-48 overflow-y-auto">{invoiceText}</pre>
            <button onClick={copyInvoiceToClipboard} type="button" className="w-full py-2.5 rounded-xl surface-secondary border border-token-strong text-xs font-extrabold text-token-primary hover:border-current transition flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span>نسخ الطلب</span>
            </button>
          </div>
        </div>

      </div>
    </div>


    <div id="drawerFooter" className={cartLines.length ? "p-4 sm:p-5 border-t border-token surface-card space-y-3 shrink-0" : "hidden p-4 sm:p-5 border-t border-token surface-card space-y-3 shrink-0"}>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between text-token-muted">
          <span>المجموع الفرعي للأصناف</span>
          <span id="drawerSubtotalVal" className="font-bold text-token-primary">{`${toAr(cartSummary.subtotal)} ر.س`}</span>
        </div>
        <div className="flex justify-between text-token-muted">
          <span>التوصيل المبرد داخل الرياض</span>
          <span id="drawerDeliveryVal" className="font-bold text-token-primary">{cartSummary.fee === 0 ? `مجاني (${toAr(0)} ر.س)` : `${toAr(cartSummary.fee)} ر.س`}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base font-black text-token-primary pt-1.5 border-t border-token">
          <span>الإجمالي النهائي (شامل الضريبة)</span>
          <span id="drawerGrandTotalVal" className="text-accent">{`${toAr(cartSummary.grandTotal)} ر.س`}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={copyInvoiceToClipboard} type="button" title="نسخ الطلب" className="px-3.5 py-3.5 rounded-2xl surface-secondary border border-token-strong text-token-primary font-extrabold text-xs hover:border-current transition flex items-center justify-center gap-1.5 shrink-0">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
          <span>نسخ الطلب</span>
        </button>

        <button onClick={submitWhatsAppOrder} type="button" className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1E8E4E] hover:bg-[#187740] text-white font-black text-xs sm:text-sm shadow-lg active:scale-[0.99] transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            <path d="M8 12h.01"></path><path d="M12 12h.01"></path><path d="M16 12h.01"></path>
          </svg>
          <span>إرسال الطلب عبر واتساب</span>
        </button>
      </div>
    </div>
  </aside>






<div id="waDispatchModal" onClick={(event) => { if (event.target === event.currentTarget) closeWaDispatchModal(); }} className={dispatchOpen ? "fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm" : "hidden fixed inset-0 z-50 items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm"}>
    <div className="surface-card border border-token rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </span>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-black text-token-primary">فاتورة طلبك جاهزة للإرسال</h3>
            <p className="text-xs text-token-muted">محادثة خدمة عملاء جمر — الرياض</p>
          </div>
        </div>
        <button onClick={closeWaDispatchModal} type="button" className="w-8 h-8 rounded-xl surface-secondary text-token-primary flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <p className="text-xs text-token-muted font-body leading-relaxed">
        تم تجهيز تفاصيل طلبك بالكامل. اضغط لفتح محادثة واتساب مباشرة أو انسخ نص الطلب أدناه:
      </p>

      <pre id="waDispatchPre" className="text-[11px] leading-relaxed whitespace-pre-wrap font-body text-token-primary surface-secondary p-3.5 rounded-2xl border border-token max-h-52 overflow-y-auto">{invoiceText}</pre>

      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={copyInvoiceToClipboard} type="button" className="py-3 rounded-xl surface-secondary border border-token-strong font-extrabold text-xs text-token-primary hover:border-current transition flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
          <span>نسخ الطلب</span>
        </button>
        <a id="waDirectLink" target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl bg-[#1E8E4E] hover:bg-[#187740] text-white font-extrabold text-xs shadow transition flex items-center justify-center gap-1.5" href={whatsAppHref}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          </svg>
          <span>متابعة في واتساب</span>
        </a>
      </div>
    </div>
  </div>






<div id="toastAlert" className={toastMessage ? 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform max-w-[92vw] opacity-100 translate-y-0' : 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform -translate-y-2 max-w-[92vw] opacity-0'}>
    <div className="px-4 py-2.5 rounded-2xl bg-[#1E1B18] dark:bg-[#F5EFE6] text-white dark:text-[#12100E] text-xs font-extrabold shadow-xl flex items-center gap-2">
      <span id="toastSvgHolder" className="text-[#E05A2B] dark:text-[#8B261D] shrink-0">{toastIcon && <Icon name={toastIcon} className="w-4 h-4" />}</span>
      <span id="toastMessageText" className="truncate">{toAr(toastMessage)}</span>
    </div>
  </div>



    </>
  );
}
