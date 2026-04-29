"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import apiCart from "@/apiProvider/cart.provider";

interface CartContextType {
    cartItems: any[];
    cartCount: number;
    fetchCart: () => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isLoggedIn } = useAuth();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        const userId = isLoggedIn ? (user?._id || user?.id) : undefined;

        if (!userId) {
            setCartItems([]);
            return;
        }

        try {
            setLoading(true);
            const { status, response } = await apiCart.list(userId);
            if (status) {
                setCartItems(response.data || []);
            }
        } catch (error) {
            console.error("Cart fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{ cartItems, cartCount, fetchCart, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
