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
        'cart': 'السلة',
        'favorites': 'المفضلة',
        'profile': 'حسابي',
        'welcome': 'يا هلا بمقاضيك',
        'login': 'تسجيل الدخول',
        'logout': 'تسجيل خروج',
        'search': 'ابحث',
    },
    egyptian: {
        'home': 'الرئيسية',
        'cart': 'العربية',
        'favorites': 'المفضلات',
        'profile': 'حسابي',
        'welcome': 'أهلاً بيك يا باشا',
        'login': 'دخول',
        'logout': 'خروج',
        'search': 'دور',
    },
    syrian: {
        'home': 'الرئيسية',
        'cart': 'السلة',
        'favorites': 'المفضلة',
        'profile': 'حسابي',
        'welcome': 'أهلاً وسهلاً شرفتونا',
        'login': 'فوت',
        'logout': 'اطلع',
        'search': 'دوّر',
    },
    jordanian: {
        'home': 'الرئيسية',
        'cart': 'السلة',
        'favorites': 'مفضلتي',
        'profile': 'حسابي',
        'welcome': 'يا هلا بالغالي',
        'login': 'فوت عالنظام',
        'logout': 'اطلع',
        'search': 'فتّش',
    },
};

export const useTranslation = () => {
    const dialect = useDialectStore((state) => state.dialect);

    const t = (key: string): string => {
        return dialectDictionary[dialect]?.[key] || key;
    };

    return { t, dialect };
};
