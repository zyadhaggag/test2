import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Dialect = 'saudi' | 'egyptian' | 'syrian' | 'jordanian';

interface DialectState {
    dialect: Dialect;
    setDialect: (dialect: Dialect) => void;
}

export const useDialectStore = create<DialectState>()(
    persist(
        (set) => ({
            dialect: 'saudi', // Default is Saudi
            setDialect: (dialect) => set({ dialect }),
        }),
        {
            name: 'dialect-storage',
        }
    )
);

export const dialectDictionary: Record<Dialect, Record<string, string>> = {
    saudi: {
        'home': 'الرئيسية',
        'cart': 'مقاضيك',
        'favorites': 'مفضلتي',
        'profile': 'حسابي',
        'welcome': 'يا هلا وسهلا بمقاضيك',
        'login': 'دخول',
        'logout': 'تسجيل خروج',
        'search': 'وش تدور عليه؟',
        'buy_now': 'اشتر الحين',
        'add_to_cart': 'ضفه للسلة',
        'price': 'السعر',
        'total': 'المجموع',
        'categories': 'الأقسام',
        'settings': 'الإعدادات',
        'support': 'الدعم الفني',
        'fast_delivery': 'توصيل طيارة',
        'guarantee': 'مضمون وشرط',
    },
    egyptian: {
        'home': 'الرئيسية',
        'cart': 'العربية',
        'favorites': 'المفضلات',
        'profile': 'حسابي',
        'welcome': 'أهلاً بيك يا باشا',
        'login': 'دخول',
        'logout': 'خروج',
        'search': 'بتدور على إيه؟',
        'buy_now': 'اشترِ دلوقتي',
        'add_to_cart': 'حطه في العربية',
        'price': 'السعر',
        'total': 'الحساب',
        'categories': 'الأقسام',
        'settings': 'الظبط',
        'support': 'خدمة العملا',
        'fast_delivery': 'توصيل هوا',
        'guarantee': 'مضمون يا ريس',
    },
    syrian: {
        'home': 'الرئيسية',
        'cart': 'السلة',
        'favorites': 'المفضلة',
        'profile': 'حسابي',
        'welcome': 'أهلاً وسهلاً شرفتونا',
        'login': 'فوت',
        'logout': 'اطلع',
        'search': 'عم تدور على شي؟',
        'buy_now': 'اشتري هلق',
        'add_to_cart': 'حطو بالسلة',
        'price': 'السعر',
        'total': 'الحساب',
        'categories': 'الأقسام',
        'settings': 'الإعدادات',
        'support': 'الدعم',
        'fast_delivery': 'توصيل طيارة',
        'guarantee': 'مكفول ومضمون',
    },
    jordanian: {
        'home': 'الرئيسية',
        'cart': 'السلة',
        'favorites': 'مفضلتي',
        'profile': 'حسابي',
        'welcome': 'يا هلا بالغالي',
        'login': 'فوت عالنظام',
        'logout': 'اطلع',
        'search': 'على شو بتفتش؟',
        'buy_now': 'اشتري هسا',
        'add_to_cart': 'ضيفه للسلة',
        'price': 'السعر',
        'total': 'المجموع',
        'categories': 'الأقسام',
        'settings': 'الإعدادات',
        'support': 'الدعم',
        'fast_delivery': 'توصيل سريع',
        'guarantee': 'مكفول',
    },
};

export const useTranslation = () => {
    const dialect = useDialectStore((state) => state.dialect);

    const t = (key: string): string => {
        return dialectDictionary[dialect]?.[key] || key;
    };

    return { t, dialect };
};
