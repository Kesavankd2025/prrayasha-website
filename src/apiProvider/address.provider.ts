import apiClient from "@/lib/api-client";

class AddressProvider {
    async list() {
        try {
            const res = await apiClient.get("/address/list");
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("List addresses error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async add(data: any) {
        try {
            const res = await apiClient.post("/address/add", data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Add address error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async update(id: string, data: any) {
        try {
            const res = await apiClient.put(`/address/update/${id}`, data);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Update address error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async remove(id: string) {
        try {
            const res = await apiClient.delete(`/address/delete/${id}`);
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Delete address error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }

    async setDefault(id: string) {
        try {
            const res = await apiClient.put(`/address/set-default/${id}`, {});
            return { status: true, response: res.data } as { status: true; response: any };
        } catch (error) {
            console.error("Set default address error:", error);
            return { status: false, error } as { status: false; error: any };
        }
    }
}

const apiAddress = new AddressProvider();
export default apiAddress;
