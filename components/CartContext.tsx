"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
    id: string;
    title: string;
    price: number;
    image: string;
    type: string;
};

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => boolean;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartTotal: number;
    isInCart: (id: string) => boolean;
}

const CART_STORAGE_KEY = 'ndv-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);


    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch { }
        setHydrated(true);
    }, []);


    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const addToCart = (item: CartItem): boolean => {
        const alreadyInCart = items.some((i) => i.id === item.id);
        if (alreadyInCart) return false;
        setItems((prev) => [...prev, item]);
        setIsCartOpen(true);
        return true;
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const isInCart = (id: string) => items.some((i) => i.id === id);

    const cartTotal = items.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider
            value={{
                items, addToCart, removeFromCart, clearCart,
                isCartOpen, setIsCartOpen, cartTotal, isInCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
