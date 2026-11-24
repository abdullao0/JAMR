import type { IconName } from './icons';

export type Protein = 'all' | 'beef' | 'lamb' | 'chicken' | 'mixed';
export type CategoryId = 'all' | 'boxes' | 'skewers' | 'burgers' | 'steaks' | 'poultry' | 'sauces';

export interface StoreCategory {
  id: CategoryId;
  name: string;
  icon: IconName;
}

interface ItemBase {
  id: string;
  category: CategoryId;
  protein: Protein;
  name: string;
  price: number;
  servesLabel: string;
  badge: string;
  image: string;
  summary: string;
  grillTip: string;
}

export interface GatheringBox extends ItemBase {
  type: 'box';
  weightLabel: string;
  badgeTone: 'gold' | 'ember';
  contentsPills: string[];
  fullBreakdown: string[];
}

export interface IndividualTray extends ItemBase {
  type: 'tray' | 'sauce';
  specPill: string;
  customizableSeasoning: boolean;
}

export const WHATSAPP_PHONE = '966500000000';
export const FREE_DELIVERY_MIN = 350;
export const DELIVERY_FEE = 25;

export const DELIVERY_DAYS = [
  { id: 'today', label: 'اليوم', note: 'تحضير طازج فوري' },
  { id: 'tomorrow', label: 'غداً', note: 'جدولة مبكرة مضمونة' },
  { id: 'thursday', label: 'الخميس — جمعات وكشتات', note: 'الأعلى طلباً بالرياض' },
  { id: 'friday', label: 'الجمعة', note: 'توصيل مبرد للغداء والعشاء' }
];

export const DELIVERY_WINDOWS = [
  { id: 'slot1', label: '١٢:٠٠ ظهراً – ٤:٠٠ عصراً', shortLabel: '١٢:٠٠ – ٤:٠٠ م', desc: 'مثالي لغداء العائلة والاستراحات' },
  { id: 'slot2', label: '٤:٠٠ عصراً – ٨:٠٠ مساءً', shortLabel: '٤:٠٠ – ٨:٠٠ م', desc: 'الموعد الأنسب لشوي المساء والكشتات' },
  { id: 'slot3', label: '٨:٠٠ مساءً – ١١:٠٠ مساءً', shortLabel: '٨:٠٠ – ١١:٠٠ م', desc: 'لسهرات الشوي المتأخرة والمخيمات' }
];

export const RIYADH_DISTRICTS = [
  'حي الملقا',
  'حي الياسمين',
  'حي النرجس',
  'حي حطين',
  'حي الصحافة',
  'حي العليا',
  'الرمال / الثمامة',
  'العمارية / الدرعية'
];

export const CATEGORIES: StoreCategory[] = [
  { id: 'all', name: 'الكل', icon: 'flame' },
  { id: 'boxes', name: 'بوكسات الجمعات', icon: 'box' },
  { id: 'skewers', name: 'أوصال وشيش وكباب', icon: 'skewer' },
  { id: 'burgers', name: 'برجر', icon: 'layers' },
  { id: 'steaks', name: 'ستيك وأضلاع', icon: 'flameKindling' },
  { id: 'poultry', name: 'دجاج متبل', icon: 'utensils' },
  { id: 'sauces', name: 'صوصات وتتبيلات', icon: 'droplet' }
];

// ========================================================================
// 4. PRODUCT CATALOG (6 GATHERING BOXES + 14 INDIVIDUAL TRAYS & SAUCES)
// ========================================================================
export const GATHERING_BOXES: GatheringBox[] = [
  {
    id: 'box-jamr-kashta',
    type: 'box',
    category: 'boxes',
    protein: 'mixed',
    name: 'بوكس كشتة جمر',
    price: 420,
    servesLabel: 'يكفي ٦ - ٨ أشخاص',
    weightLabel: '٣.٤ كجم صافي',
    badge: 'الأكثر مبيعاً للكشتات',
    badgeTone: 'ember',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85',
    summary: 'التوليفة المثالية لطلعة البر أو الاستراحة — تجمع أسياخ البلاك أنجوس والشيش والكباب مع برجر الواغيو والصوصات.',
    contentsPills: [
      '١٢ سيخ أوصال أنجوس',
      '١٢ سيخ شيش طاووق',
      '٨ أسياخ كباب نعيمي',
      '٦ برجر واغيو بالخبز',
      '٢ صوص جمر المدخن'
    ],
    fullBreakdown: [
      'صحنان أوصال بلاك أنجوس متبل (١٢ سيخ • ١ كجم)',
      'صحنان شيش طاووق بالزبادي والزعفران (١٢ سيخ • ١ كجم)',
      'صحن كباب غنم نعيمي مفروم يومياً (٨ أسياخ • ٦٠٠ جم)',
      '٦ قطع برجر واغيو (٨٠٠ جم) مع خبز بريوش البطاطس وشرائح الشيدر',
      'عبوتان من صوص جمر المدخن وشيميتشوري الأعشاب الطازجة'
    ],
    grillTip: 'اشوِ الأوصال والبرجر لمدة ٤ - ٥ دقائق لكل وجه على جمر متوسط الهدوء، وقلّب أسياخ الكباب كل دقيقة.'
  },
  {
    id: 'box-istiraha-royal',
    type: 'box',
    category: 'boxes',
    protein: 'mixed',
    name: 'بوكس الاستراحة الملكي',
    price: 680,
    servesLabel: 'يكفي ١٠ - ١٢ شخص',
    weightLabel: '٥.٨ كجم صافي',
    badge: 'وليمة الجمعات الكبيرة',
    badgeTone: 'gold',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
    summary: 'وليمة متكاملة للجمعات الموسّعة تشمل قطع ستيك الريب آي الفاخرة وتشكيلة الأسياخ الكاملة والبرجر والأجنحة.',
    contentsPills: [
      '٢ ستيك ريب آي أنجوس',
      '١٨ سيخ لحم وكباب',
      '١٦ سيخ شيش طاووق',
      '١٢ برجر واغيو بالخبز',
      'صحن أجنحة مدخنة',
      '٤ صوصات وزبدة'
    ],
    fullBreakdown: [
      'قطعتان ستيك ريب آي بلاك أنجوس بتعريق رخامي عالي (٧٠٠ جم)',
      '١٨ سيخ مشكل (أوصال لحم أنجوس + كباب غنم نعيمي طازج)',
      '١٦ سيخ شيش طاووق طري بتتبيلة الليمون والزعفران',
      '١٢ قرص برجر واغيو مع خبز البريوش والجبن المعتق',
      'صحن أجنحة دجاج مدخنة جاهزة للشوي (٦٠٠ جم)',
      '٤ عبوات صوص متنوعة + رول زبدة الثوم المشوي وإكليل الجبل'
    ],
    grillTip: 'ابدأ بتحمير قطع الريب آي على الجزء الأشد حرارة لمدة ٣ - ٤ دقائق لكل وجه ثم اتركها ترتاح ٥ دقائق قبل التقطيع.'
  },
  {
    id: 'box-burger-gatherings',
    type: 'box',
    category: 'boxes',
    protein: 'beef',
    name: 'بوكس برجر الجمعات',
    price: 245,
    servesLabel: 'يكفي ٦ - ٨ أشخاص',
    weightLabel: '١٢ قطعة • ١.٨ كجم لحم',
    badge: 'شامل الخبز والإضافات',
    badgeTone: 'ember',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85',
    summary: 'كل تفاصيل برجر الفحم المختص في بوكس واحد متكامل بدون الحاجة لشراء أي إضافات خارجية.',
    contentsPills: [
      '١٢ قرص أنجوس وواغيو',
      '١٢ خبز بريوش بطاطس',
      '١٢ شريحة شيدر معتق',
      'بصل مكرمل وهالبينو',
      '٢ صوص برجر جمر'
    ],
    fullBreakdown: [
      '١٢ قطعة برجر مشكلة يدوياً من البلاك أنجوس والواغيو (١٥٠ جم للقطعة)',
      '١٢ خبزة بريوش بطاطس طازجة للتحميص السريع على أطراف الشبكة',
      '١٢ شريحة جبن شيدر إنجليزي معتق',
      'علبة مربى البصل المكرمل + شرائح مخلل وهالبينو + عبوتان صوص جمر المدخن'
    ],
    grillTip: 'تجنب الضغط على قرص البرجر أثناء الشوي للاحتفاظ بالعصارة — ٤ دقائق لكل وجه وضع الجبن في الدقيقة الأخيرة.'
  },
  {
    id: 'box-family-grill',
    type: 'box',
    category: 'boxes',
    protein: 'mixed',
    name: 'بوكس المشاوي العائلي',
    price: 335,
    servesLabel: 'يكفي ٥ - ٦ أشخاص',
    weightLabel: '٢.٨ كجم صافي',
    badge: 'خيار العائلة المفضل',
    badgeTone: 'gold',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=85',
    summary: 'تشكيلة عائلية متوازنة ترضي الكبار والصغار من الأسياخ الطرية والريش ونصف الدجاج المسحب.',
    contentsPills: [
      '٨ أسياخ أوصال أنجوس',
      '٨ أسياخ كباب نعيمي',
      '٨ أسياخ شيش طاووق',
      'نصف دجاجة مسحب',
      '٢ صوص جمر'
    ],
    fullBreakdown: [
      'صحن كبير أوصال لحم بلاك أنجوس طري (٨ أسياخ • ٧٠٠ جم)',
      'صحن كباب غنم نعيمي مفروم طازج (٨ أسياخ • ٧٠٠ جم)',
      'صحن شيش طاووق متبل بالزبادي (٨ أسياخ • ٧٠٠ جم)',
      'نصف دجاجة مسحب مخلية العظم جاهزة لشبك الشوي (٧٠٠ جم)',
      'عبوتان من صوصات جمر الطازجة'
    ],
    grillTip: 'ضع الدجاج المسحب في شبك الشوي المزدوج واقلبه كل ٤ دقائق لمدة ١٦ دقيقة حتى يتحمر بالتساوي.'
  },
  {
    id: 'box-steak-chops',
    type: 'box',
    category: 'boxes',
    protein: 'beef',
    name: 'بوكس الستيك والريش الفاخر',
    price: 365,
    servesLabel: 'يكفي ٤ أشخاص',
    weightLabel: '٢.٢ كجم صافي',
    badge: 'قطعيات النخبة',
    badgeTone: 'gold',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=85',
    summary: 'مخصص لعشاق القطعيات الرخامية الفاخرة وريش الغنم النعيمي مع زبدة الأعشاب وصوص الشيميتشوري.',
    contentsPills: [
      '٢ ريب آي بلاك أنجوس',
      '٢ ستريبلوين نيويورك',
      '٨ ريش غنم نعيمي',
      'زبدة الثوم وإكليل الجبل',
      'صوص شيميتشوري'
    ],
    fullBreakdown: [
      'قطعتان ستيك ريب آي بلاك أنجوس (٧٠٠ جم إجمالي)',
      'قطعتان ستيك نيويورك ستريبلوين (٦٤٠ جم إجمالي)',
      'صحن ريش غنم نعيمي متبلة بالأعشاب الجبلية وزيت الزيتون (٨ قطع • ٦٠٠ جم)',
      'رول زبدة الثوم المشوي وإكليل الجبل + عبوة صوص شيميتشوري طازج'
    ],
    grillTip: 'اشوِ الستيك ٣ - ٤ دقائق لكل وجه والريش ٣ دقائق لكل وجه، وأضف شريحة الزبدة فور رفعها عن الفحم.'
  },
  {
    id: 'box-poultry-feast',
    type: 'box',
    category: 'boxes',
    protein: 'chicken',
    name: 'بوكس شوي الدجاج المتبل',
    price: 195,
    servesLabel: 'يكفي ٥ - ٦ أشخاص',
    weightLabel: '٢.٩ كجم صافي',
    badge: 'دجاج مبرد يومي',
    badgeTone: 'ember',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=85',
    summary: 'تشكيلة دجاج محلي مبرد ١٠٠٪ بتتبيلات متنوعة جاهزة للمنقل لعشاق المشويات الخفيفة والطرية.',
    contentsPills: [
      '١٢ سيخ شيش طاووق',
      '٢ نصف دجاجة مسحب',
      '١٢ قطعة أجنحة مدخنة',
      '٢ صوص ثوم وليمون'
    ],
    fullBreakdown: [
      'صحنان شيش طاووق بالزبادي والزعفران (١٢ سيخ • ١ كجم)',
      'قطعتان نصف دجاجة مسحب مخلية العظم بتتبيلة حلبية (١.٣ كجم)',
      'صحن أجنحة دجاج مدخنة بالبابريكا والعسل البري (١٢ قطعة • ٦٠٠ جم)',
      'عبوتان صوص الثوم الكريمي وتتبيلة الليمون والأعشاب'
    ],
    grillTip: 'يُشوى الدجاج على جمر هادئ إلى متوسط لمدة ١٢ - ١٦ دقيقة لضمان الاستواء الكامل وبقاء اللحم طرياً.'
  }
];

export const INDIVIDUAL_TRAYS: IndividualTray[] = [
  // Skewers
  {
    id: 'tray-angus-awsal',
    type: 'tray',
    category: 'skewers',
    protein: 'beef',
    name: 'صحن أوصال بلاك أنجوس',
    price: 78,
    specPill: '٥٠٠ جم • ٦ أسياخ',
    servesLabel: 'يكفي ٢ - ٣ أشخاص',
    badge: 'طراوة استثنائية',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    summary: 'مكعبات منتقاة من فيليه وستريبلوين البلاك أنجوس مشكوكة في الأسياخ وجاهزة فوراً للشوي.',
    grillTip: '٤ - ٥ دقائق لكل وجه على جمر متوسط للحصول على قلب طري وعصاري.'
  },
  {
    id: 'tray-naimi-kabab',
    type: 'tray',
    category: 'skewers',
    protein: 'lamb',
    name: 'صحن كباب غنم نعيمي بلدي',
    price: 68,
    specPill: '٥٠٠ جم • ٧ أسياخ',
    servesLabel: 'يكفي ٢ - ٣ أشخاص',
    badge: 'فرم يومي طازج',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
    summary: 'كباب غنم نعيمي مفروم يوم الطلب بنسبة دهن موزونة تمنع التفكك على الفحم وتمنح طعماً أصيلاً.',
    grillTip: 'قلّب الأسياخ كل ٤٥ ثانية في أول ٣ دقائق حتى يتماسك الكباب حول السيخ.'
  },
  {
    id: 'tray-lamb-chops',
    type: 'tray',
    category: 'skewers',
    protein: 'lamb',
    name: 'صحن ريش غنم نعيمي فاخرة',
    price: 96,
    specPill: '٥٠٠ جم • ٨ قطع',
    servesLabel: 'يكفي ٢ - ٣ أشخاص',
    badge: 'قطعية مختارة',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    summary: 'ريش غنم نعيمي طرية مشذبة بعناية لتستوي سريعاً على الجمر وتحتفظ بطراوتها.',
    grillTip: '٣ - ٤ دقائق لكل وجه على جمر حيّ للحصول على تحمير ذهبي شهي.'
  },

  // Burgers
  {
    id: 'tray-wagyu-burger',
    type: 'tray',
    category: 'burgers',
    protein: 'beef',
    name: 'صحن برجر واغيو للشوي',
    price: 74,
    specPill: '٤ قطع • ٦٠٠ جم',
    servesLabel: '١٥٠ جم للقطعة الواحدة',
    badge: 'تعريق رخامي عالي',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    summary: 'أقراص برجر واغيو سميكة تمنحك قواماً عصارياً غنياً ونكهة شوي فحم لا تُضاهى.',
    grillTip: '٤ دقائق لكل وجه على نار متوسطة دون الضغط على القرص بالملعقة.'
  },
  {
    id: 'tray-angus-sliders',
    type: 'tray',
    category: 'burgers',
    protein: 'beef',
    name: 'صحن برجر بلاك أنجوس كلاسيك',
    price: 64,
    specPill: '٦ قطع • ٦٠٠ جم',
    servesLabel: '١٠٠ جم للقطعة الواحدة',
    badge: 'سريع التحضير',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    summary: 'ستة أقراص برجر بلاك أنجوس صافي مثالية للجمعات العائلية وساندويتشات البريوش.',
    grillTip: '٣ دقائق لكل وجه فقط على جمر متوسط.'
  },

  // Steaks & Ribs
  {
    id: 'tray-ribeye-steak',
    type: 'tray',
    category: 'steaks',
    protein: 'beef',
    name: 'ستيك ريب آي بلاك أنجوس',
    price: 115,
    specPill: '٣٥٠ جم • سماكة ٣ سم',
    servesLabel: 'قطعة ستيك فاخرة',
    badge: 'درجة رخامية فاخرة',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    summary: 'قطعة ريب آي غنية بالتعريق الدهني الذي يذوب فوق الجمر ليمنحك قشرة محمّرة وقلباً طرياً.',
    grillTip: '٣ - ٤ دقائق لكل وجه على جمر حار، ثم تُترك لترتاح ٥ دقائق قبل التقطيع.'
  },
  {
    id: 'tray-striploin-steak',
    type: 'tray',
    category: 'steaks',
    protein: 'beef',
    name: 'ستيك نيويورك ستريبلوين',
    price: 98,
    specPill: '٣٢٠ جم • قطعة سميكة',
    servesLabel: 'يكفي ١ - ٢ شخص',
    badge: 'نكهة لحم مركزة',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    summary: 'قطعية نيويورك ستريب المتوازنة بحافة دهنية جانبية تضيف نكهة مدخنة غنية على الفحم.',
    grillTip: '٣ - ٤ دقائق لكل وجه مع تحمير الحافة الدهنية لمدة ٣٠ ثانية.'
  },
  {
    id: 'tray-short-ribs',
    type: 'tray',
    category: 'steaks',
    protein: 'beef',
    name: 'أضلاع شورت ريبس للشوي البطيء',
    price: 138,
    specPill: '١.٢ كجم • ٣ أضلاع كاملة',
    servesLabel: 'يكفي ٣ - ٤ أشخاص',
    badge: 'للتدخين والشوي الهادئ',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    summary: 'أضلاع بقرية غنية باللحم مجهزة لعشاق التدخين والشوي غير المباشر على الفحم الهادئ.',
    grillTip: 'تُشوى على حرارة هادئة غير مباشرة وتُغلف بورق الجزار للاحتفاظ بالعصارة.'
  },

  // Marinated Poultry
  {
    id: 'tray-shish-tawook',
    type: 'tray',
    category: 'poultry',
    protein: 'chicken',
    name: 'صحن شيش طاووق بالزعفران',
    price: 42,
    specPill: '٥٠٠ جم • ٦ أسياخ',
    servesLabel: 'دجاج محلي مبرد',
    badge: 'طراوة مضمونة',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80',
    summary: 'قطع دجاج مبرد منقوعة في الزبادي اليوناني والزعفران والليمون، أو بدون تتبيل حسب رغبتك.',
    grillTip: '٥ دقائق لكل وجه على جمر متوسط حتى تكتسب لوناً ذهبياً.'
  },
  {
    id: 'tray-smoky-wings',
    type: 'tray',
    category: 'poultry',
    protein: 'chicken',
    name: 'صحن أجنحة دجاج للشوي',
    price: 36,
    specPill: '٦٠٠ جم • ١٢ قطعة',
    servesLabel: 'يكفي ٢ - ٣ أشخاص',
    badge: 'بداية السهرة',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    summary: 'أجنحة دجاج طازجة مقسومة وجاهزة للشوي السريع وقرمشة الجلدة على أطراف المنقل.',
    grillTip: '١٠ - ١٢ دقيقة على جمر معتدل مع التقليب المستمر كل دقيقتين.'
  },
  {
    id: 'tray-boneless-chicken',
    type: 'tray',
    category: 'poultry',
    protein: 'chicken',
    name: 'نصف دجاجة مسحب للشبك',
    price: 39,
    specPill: '٦٥٠ جم • مخلي العظم',
    servesLabel: 'يكفي ٢ أشخاص',
    badge: 'مفرودة للشبك',
    customizableSeasoning: true,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    summary: 'نصف دجاجة مبردة مخلية تماماً من العظم ومفرودة لتستوي بالتساوي داخل شبك الشوي.',
    grillTip: 'ضعها في الشبك المزدوج واقلبها كل ٤ دقائق لمدة ١٦ دقيقة.'
  },

  // Sauces & Butters
  {
    id: 'sauce-jamr-signature',
    type: 'sauce',
    category: 'sauces',
    protein: 'all',
    name: 'صوص جمر المدخن الخاص',
    price: 19,
    specPill: '٢٥٠ مل • عبوة محكمة',
    servesLabel: 'للبرجر والأوصال',
    badge: 'الأكثر طلباً',
    customizableSeasoning: false,
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=80',
    summary: 'مزيج كريمي مدخن متوازن مع الفلفل الأسود المجروش ولمسة دبس خفيفة تبرز طعم الفحم.',
    grillTip: 'يُقدم بارداً للتغميس أو يُدهن داخل خبز البرجر المحمص.'
  },
  {
    id: 'sauce-chimichurri',
    type: 'sauce',
    category: 'sauces',
    protein: 'all',
    name: 'صوص شيميتشوري الأعشاب الطازجة',
    price: 24,
    specPill: '٢٢٠ مل • تحضير يومي',
    servesLabel: 'مثالي للستيك والريش',
    badge: 'رفيق الستيك',
    customizableSeasoning: false,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    summary: 'أعشاب طازجة مفرومة يدوياً مع الثوم والأوريجانو وزيت الزيتون البكر لعشاق الستيك.',
    grillTip: 'يُسكب فوق شرائح الستيك أو الريش فور تقطيعها للتقديم.'
  },
  {
    id: 'sauce-herb-butter',
    type: 'sauce',
    category: 'sauces',
    protein: 'all',
    name: 'زبدة الثوم المشوي وإكليل الجبل',
    price: 22,
    specPill: '١٥٠ جم • رول زبدة منكهة',
    servesLabel: 'تكفي ٤ - ٦ قطع ستيك',
    badge: 'لمسة الشيف',
    customizableSeasoning: false,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    summary: 'زبدة طبيعية مخفوقة مع فصوص الثوم المشوي وإكليل الجبل وملح البحر الخشن.',
    grillTip: 'ضع شريحة فوق الستيك الساخن فور رفعه عن الجمر لتذوب فوقه.'
  }
];

export const SEASONING_CHOICES = ['تتبيلة جمر الخاصة', 'ملح وفلفل فقط'];
export const ALL_ITEMS = [...GATHERING_BOXES, ...INDIVIDUAL_TRAYS];

// ========================================================================
// 5. APPLICATION STATE
// ========================================================================
