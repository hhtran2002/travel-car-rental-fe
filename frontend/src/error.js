export function normalizeApiError(err) {
    // Axios error
    if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;

        const message =
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : "Có lỗi xảy ra");

        return { status, message, data };
    }

    // Network / CORS / server down
    return {
        status: 0,
        message: "Không kết nối được server (kiểm tra backend / CORS / mạng)",
        data: null,
    };
}