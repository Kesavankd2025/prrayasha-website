import apiClient from "@/lib/api-client";

class CouponProvider {
    async validate(data: {
        code: string;
        subTotal: number;
        customerId?: string;
        cartItems: any[]
    }) {
        try {
            const res = await apiClient.post("/coupons/validate", data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Coupon validate error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }
}

export default new CouponProvider();
