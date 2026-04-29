import apiClient from "@/lib/api-client";

class WishlistProvider {
    async add(data: {
        userId: string;
        productId: string;
        combination?: {
            attributeId: string;
            valueId: string;
            value: string;
        }[];
    }) {
        try {
            const res = await apiClient.post("/wishlist/add", data);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Wishlist add error:", error);
            throw error; // Let the component handle specific toast errors
        }
    }

    async list(userId: string) {
        try {
            const res = await apiClient.get(`/wishlist/list?userId=${userId}`);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Wishlist fetch error:", error);
            return { status: false, error };
        }
    }

    async remove(id: string) {
        try {
            const res = await apiClient.delete(`/wishlist/remove/${id}`);
            return { status: true, response: res.data };
        } catch (error) {
            console.error("Wishlist remove error:", error);
            return { status: false, error };
        }
    }
}

const apiWishlist = new WishlistProvider();
export default apiWishlist;
