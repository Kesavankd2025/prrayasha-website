import apiClient from "@/lib/api-client";

class NotifyMeProvider {
    async add(data: {
        userId: string;
        productId: string;
        combination: any[];
    }) {
        try {
            const res = await apiClient.post("notifyme/add", data);
            return { status: true, response: res.data };
        } catch (error: any) {
            console.error("NotifyMe add error:", error);
            throw error;
        }
    }

    async reviews(productId: any) {
        try {
            const res = await apiClient.get(`/reviews/product/${productId}`);
            return { status: true, response: res.data }

        }
        catch (error: any) {
            console.error("reviews error:", error);
            throw error;
        }
    }

    async addReview(data: { productId: string; orderId: string; rating: number; comment: string; userId?: string }) {
        try {
            const res = await apiClient.post(`/reviews/add`, data);
            return { status: true, response: res.data }
        }
        catch (error: any) {
            console.error("addReview error:", error);
            throw error;
        }
    }

    async checkUserReview(params: { productId: string; orderId: string }) {
        try {
            const res = await apiClient.get(
                `/reviews/check?productId=${params.productId}&orderId=${params.orderId}`
            );
            return { status: true, response: res.data };
        } catch (error: any) {
            return { status: false, response: null };
        }
    }
}

const apiNotifyMe = new NotifyMeProvider();
export default apiNotifyMe;
