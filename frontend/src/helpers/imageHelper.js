// src/utils/imageHelper.js
import imageCompression from 'browser-image-compression';

/**
 * Hàm nén ảnh giữ nguyên kích thước (Dimensions) nhưng giảm dung lượng (File size)
 * @param {File} imageFile - File ảnh gốc
 * @param {number} maxSizeMB - Dung lượng tối đa (Mặc định 1MB)
 * @returns {Promise<File>} - Trả về file ảnh đã được nén
 */
export const compressImageProcess = async (imageFile) => {
    // Không ép cứng 1MB nữa, chúng ta tập trung vào "Độ nét"
    const options = {
        maxWidthOrHeight: 1920, // Chuẩn Full HD: Đủ nét căng cho mọi màn hình Laptop/PC mà không tràn RAM
        initialQuality: 0.8,    // 0.8 (80%): Đây là con số thần thánh. Mắt người không thể phân biệt được 80% và 100%, nhưng dung lượng giảm một nửa!
        useWebWorker: true,
        fileType: 'image/webp'  // WebP nén siêu tốt và giữ chi tiết cực đỉnh
    };

    try {
        const compressedBlob = await imageCompression(imageFile, options);
        // Chuyển Blob về dạng File để tương thích với FormData
        const compressedFile = new File([compressedBlob], imageFile.name.replace(/\.[^/.]+$/, ".webp"), {
            type: 'image/webp',
            lastModified: Date.now(),
        });

        return compressedFile;
    } catch (error) {
        console.error('Lỗi khi nén ảnh:', error);
        // Nếu nén lỗi, cứ trả về file gốc để upload (Backend sẽ bắt lỗi dung lượng sau)
        return imageFile;
    }
};