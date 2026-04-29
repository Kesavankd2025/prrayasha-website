import apiClient from "@/lib/api-client";

class AuthProvider {
    /**
     * Send OTP for Login
     */
    async sendLoginOtp(phoneNumber: string) {
        try {
            const response = await apiClient.post("/auth/login/send-otp", { phoneNumber });
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Login OTP error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Verify OTP for Login
     */
    async verifyLoginOtp(phoneNumber: string, otp: string) {
        try {
            const response = await apiClient.post("/auth/login/verify-otp", { phoneNumber, otp });
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Login verify error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Send OTP for Registration
     */
    async sendRegisterOtp(phoneNumber: string) {
        try {
            const response = await apiClient.post("/auth/register/send-otp", { phoneNumber });
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Register OTP error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Verify OTP for Registration
     */
    async verifyRegisterOtp(payload: { phoneNumber: string, otp: string, fullName: string, email: string }) {
        try {
            const response = await apiClient.post("/auth/register/verify-otp", payload);
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Register verify error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Send OTP for Guest Login
     */
    async sendGuestOtp(phoneNumber: string) {
        try {
            const response = await apiClient.post("/auth/guest/send-otp", { phoneNumber });
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Guest OTP error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Verify OTP for Guest Login
     */
    async verifyGuestOtp(phoneNumber: string, otp: string) {
        try {
            const response = await apiClient.post("/auth/guest/verify-otp", { phoneNumber, otp });
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Guest verify error:", error);
            return { status: false, response: error };
        }
    }
}

const apiAuth = new AuthProvider();
export default apiAuth;
