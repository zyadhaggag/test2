export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    phone_verified: boolean;
    role: UserRole;
    status: UserStatus;
    avatar_url: string | null;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category_id: string | null;
    price: number;
    old_price: number | null;
    image: string;
    rating: number;
    is_new: boolean;
    is_featured: boolean;
    tags: string[];
    status: 'active' | 'draft';
    created_at: string;
    category?: Category;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    old_price: number | null;
    rating: number;
    status: 'active' | 'draft';
    is_featured: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    created_at: string;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    product_id: string | null;
    discount_percent: number;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'draft';
    image: string | null;
    created_at: string;
    product?: Product;
}

export interface HeroSlide {
    id: string;
    image: string;
    link: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    total: number;
    status: OrderStatus;
    created_at: string;
    profile?: Profile;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    read: boolean;
    created_at: string;
    sender?: Profile;
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    netProfit: number;
    todaySales: number;
    monthlyGrowth: number;
}
