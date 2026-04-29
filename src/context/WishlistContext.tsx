"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import apiWishlist from "@/apiProvider/wishlist.provider";

interface WishlistContextType {
    wishlistItems: any[];
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (product: any, combination?: any[]) => Promise<void>;
    isInWishlist: (productId: string, combination?: any[]) => { active: boolean; id: string | null };
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoggedIn } = useAuth();
    const { showToast } = useToast();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!isLoggedIn || !user) {
            setWishlistItems([]);
            return;
        }
        setLoading(true);
        try {
            const { status, response } = await apiWishlist.list(user._id || user.id);
            if (status) {
                setWishlistItems(response.data);
            }
        } catch (error) {
            console.error("Wishlist fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const isInWishlist = useCallback((productId: string, combination?: any[]) => {
        const match = wishlistItems.find(item => {
            if (String(item.productId) !== String(productId)) return false;
            
            // If combination is provided, check it
            if (combination && item.combination) {
                if (combination.length !== item.combination.length) return false;
                return combination.every(c => 
                    item.combination.some((ic: any) => 
                        String(ic.attributeId) === String(c.attributeId) && 
                        String(ic.valueId) === String(c.valueId) &&
                        ic.value === c.value
                    )
                );
            }
            
            // If neither has combination, it's a match
            return !combination && !item.combination;
        });

        return match ? { active: true, id: match._id } : { active: false, id: null };
    }, [wishlistItems]);

    const toggleWishlist = async (product: any, combination?: any[]) => {
        if (!isLoggedIn) return; // Caller should handle redirect

        const { active, id } = isInWishlist(product._id || product.id, combination);

        try {
            if (active && id) {
                const { status, response } = await apiWishlist.remove(id);
                if (status) {
                    setWishlistItems(prev => prev.filter(item => item._id !== id));
                    showToast(response.message || "Removed from wishlist", "info");
                }
            } else {
                const { status, response } = await apiWishlist.add({
                    userId: user._id || user.id,
                    productId: product._id || product.id,
                    combination
                });
                if (status) {
                    // Re-fetch to get fully populated product data
                    await fetchWishlist();
                    showToast(response.message || "Added to wishlist", "success");
                }
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Wishlist action failed";
            showToast(msg, "error");
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, fetchWishlist, toggleWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
};
