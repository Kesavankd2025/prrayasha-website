import apiClient from "@/lib/api-client";

class HomeProvider {
    /**
     * Fetch list of categories for the website
     */
    async getCategoryList() {
        try {
            const response = await apiClient.get("category/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch categories error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of products, optionally filtered by category or subcategory
     */
    async getProductList(categoryId?: string, subCategoryId?: string, isNewArrival?: boolean, filters?: any) {
        try {
            let url = "product/list";
            const params = new URLSearchParams();
            if (categoryId) params.append("categoryId", categoryId);
            if (subCategoryId) params.append("subCategoryId", subCategoryId);
            if (isNewArrival) params.append("isNewArrival", "true");
            if (filters && Object.keys(filters).length > 0) {
                params.append("filters", JSON.stringify(filters));
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await apiClient.get(url);
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch products error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of banners
     */
    async getBannerList() {
        try {
            const response = await apiClient.get("banner/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch banners error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch product details by slug
     */
    async getProductDetails(slug: string) {
        try {
            const response = await apiClient.get(`product/details/${encodeURIComponent(slug)}`);
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch product details error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of testimonials
     */
    async getTestimonialList() {
        try {
            const response = await apiClient.get("testimonial/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch testimonials error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of youtube videos
     */
    async getYoutubeList() {
        try {
            const response = await apiClient.get("youtube/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch youtube error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of advertisements
     */
    async getAdvertisementList() {
        try {
            const response = await apiClient.get("advertisement/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch advertisements error:", error);
            return { status: false, response: error };
        }
    }

    /**
     * Fetch list of attributes for filtering
     */
    async getAttributeList() {
        try {
            const response = await apiClient.get("/attribute/list");
            return { status: true, response: response.data };
        } catch (error) {
            console.error("Fetch attributes error:", error);
            return { status: false, response: error };
        }
    }
}

const apiHome = new HomeProvider();
export default apiHome;
