import apiClient from "@/lib/api-client";

class CustomerProvider {
    /**
     * Get Dashboard Stats
     */
    async getDashboardStats() {
        try {
            const response = await apiClient.get("/customer/dashboard-stats");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Dashboard stats error:", error);
            return { status: false, response: error };
        }
    }

    async updateProfile(data: any) {
        try {
            const response = await apiClient.post("/customer/update-profile", data);
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Update profile error:", error);
            return { status: false, response: error };
        }
    }
}

const apiCustomer = new CustomerProvider();
export default apiCustomer;
