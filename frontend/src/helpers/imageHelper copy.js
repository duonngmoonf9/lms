// src/utils/imageHelper.js
import imageCompression from 'browser-image-compression';

/**
 * Hàm nén ảnh giữ nguyên kích thước (Dimensions) nhưng giảm dung lượng (File size)
 * @param {File} imageFile - File ảnh gốc
 * @param {number} maxSizeMB - Dung lượng tối đa (Mặc định 1MB)
 * @returns {Promise<File>} - Trả về file ảnh đã được nén
 */
export const compressImageProcess = async (imageFile, maxSizeMB = 1) => {
    // Nếu dung lượng ảnh đã nhỏ hơn mức yêu cầu (VD: < 1MB), trả về file gốc luôn
    if (imageFile.size <= maxSizeMB * 1024 * 1024) {
        return imageFile;
    }

    const options = {
        maxSizeMB: maxSizeMB,
        useWebWorker: true,
        fileType: 'image/webp', // Ép sang webp để nén tối đa mà không vỡ hạt
        // Không khai báo maxWidthOrHeight để giữ nguyên kích thước gốc

        // BỔ SUNG QUAN TRỌNG:
        // Ép giới hạn chiều rộng/cao tối đa để trình duyệt không bị sập Canvas
        // Kích thước 3000px là đủ nét cho Web mà không làm tràn RAM
        maxWidthOrHeight: 3000,
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