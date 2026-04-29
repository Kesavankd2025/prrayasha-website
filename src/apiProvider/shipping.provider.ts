import apiClient from "@/lib/api-client";

class ShippingProvider {
    async calculate(data: { state: string; totalAmount: number }) {
        try {
            const res = await apiClient.post("/shipping/calculate", data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Calculate shipping error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }
}

export default new ShippingProvider();
