import apiClient from "@/lib/api-client";

class CartProvider {
    async add(data: {
        userId: string;
        productId: string;
        qty: number;
        combination: any[];
    }) {
        try {
            const res = await apiClient.post("cart/add", data);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Cart add error:", error);
            throw error;
        }
    }

    async list(userId: string) {
        try {
            const res = await apiClient.get(`/cart/list?userId=${userId}`);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Cart list error:", error);
            return { status: false, error };
        }
    }

    async updateQty(id: string, qty: number) {
        try {
            const res = await apiClient.put(`cart/update-qty/${id}`, { qty });
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Cart update error:", error);
            throw error;
        }
    }

    async remove(id: string) {
        try {
            const res = await apiClient.delete(`cart/remove/${id}`);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Cart remove error:", error);
            return { status: false, error };
        }
    }

    async clear(userId: string) {
        try {
            const res = await apiClient.delete(`/cart/clear?userId=${userId}`);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Cart clear error:", error);
            return { status: false, error };
        }
    }
}

const apiCart = new CartProvider();
export default apiCart;
