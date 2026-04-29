import apiClient from "@/lib/api-client";

class OrderProvider {
    async create(data: any) {
        try {
            const res = await apiClient.post("/order/create", data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Order create error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async list(params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
        try {
            const res = await apiClient.get("/order/list", { params });
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Order list error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async getById(id: string) {
        try {
            const res = await apiClient.get(`/order/details/${id}`);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Order details error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async cancel(id: string, reason: string) {
        try {
            const res = await apiClient.post(`/order/cancel/${id}`, { reason });
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Order cancel error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }
    async initiatePhonepe(data: { orderId: string, amount: number }) {
        try {
            const res = await apiClient.post("/phonepe/initiate", data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Phonepe initiate error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }
}

const apiOrder = new OrderProvider();
export default apiOrder;
