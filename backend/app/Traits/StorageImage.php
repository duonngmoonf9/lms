<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

trait StorageImage
{
    public function storageImageTraitUpload($fileRequest, $folderName, $foderChildren)
    {
        $nameExtension = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg', 'ai', 'eps', 'cdr', 'heic', 'heif', 'raw', 'ico'];
        $ext = strtolower($fileRequest->getClientOriginalExtension());
        if (in_array($ext, $nameExtension)) {
            $nameOrigin = $fileRequest->getClientOriginalName();
            $nameNew = strtotime('now') . '-' . uniqid() . '.' . $ext;
            $filePath = $fileRequest->storeAs($folderName . '/' . (Auth::id() ?? 'guest') . '/' . str::slug($foderChildren), $nameNew, 'public');
            $dataFile = [
                'file_name' => $nameOrigin,
                'file_path' => Storage::url($filePath) //chuyển đôi chữ public thành Storage
            ];
            return $dataFile;
        }
        return null;
    }

    public function storageVideoTraitUpload($fileRequest, $folderName, $foderChildren)
    {
        $nameExtension = ['mp4'];
        $ext = strtolower($fileRequest->getClientOriginalExtension());
        if (in_array($ext, $nameExtension)) {
            $nameOrigin = $fileRequest->getClientOriginalName();
            $nameNew = strtotime('now') . '-' . uniqid() . '.' . $ext;
            $filePath = $fileRequest->storeAs($folderName . '/' . (Auth::id() ?? 'guest') . '/' . str::slug($foderChildren), $nameNew, 'public');
            $dataFile = [
                'file_name' => $nameOrigin,
                'file_path' => Storage::url($filePath) //chuyển đôi chữ public thành Storage
            ];
            return $dataFile;
        }
        return null;
    }

    public function fileDelete($filePath)
    {
        $filePath_str = str_replace('/storage', '', $filePath);
        try {
            if (Storage::disk('public')->exists($filePath_str)) {
                Storage::disk('public')->delete($filePath_str);
            }
        } catch (\Exception $e) {
            Log::error("File delete error: " . $e->getMessage() . '-----' . "line: " . $e->getLine());
            return null;
        }
    }

    public function folderDelete($filePath)
    {
        // Loại bỏ '/storage' để lấy đường dẫn tương đối
        $filePath_str = str_replace('/storage', '', $filePath);

        // Dùng dirname() để lấy tên thư mục chứa file
        // Ví dụ: dirname('/lessons/1/video.mp4') sẽ trả về '/lessons/1'
        $directoryPath = dirname($filePath_str);

        try {
            // Kiểm tra xem thư mục có tồn tại không
            if (Storage::disk('public')->exists($directoryPath)) {
                // Lệnh này sẽ xóa thư mục và TẤT CẢ các file, thư mục con bên trong nó
                Storage::disk('public')->deleteDirectory($directoryPath);
            }
        } catch (\Exception $e) {
            Log::error("Folder delete error: " . $e->getMessage() . '-----' . "line: " . $e->getLine());
            return null;
        }
    }

    public function resizeImage($filePath, $folderName = 'small', $width = 750, $height = 450)
    {
        try {
            // 1. Chuyển đường dẫn web ("/storage/...") thành đường dẫn vật lý tuyệt đối của ổ cứng
            $physicalPath = public_path($filePath);

            // 2. Tách tên file và thư mục từ đường dẫn vật lý
            $dir = dirname($physicalPath);
            $fileName = basename($physicalPath);

            // 3. Đường dẫn thư mục mới (folder 'small')
            $newDir = $dir . '/' . $folderName;

            // 4. Đường dẫn file mới
            $newPath = $newDir . '/' . $fileName;

            // 5. Kiểm tra và tạo thư mục 'small' nếu nó chưa tồn tại
            if (!file_exists($newDir)) {
                mkdir($newDir, 0755, true);
            }

            // 6. Đọc ảnh, resize và lưu (dùng đường dẫn vật lý)
            $image = Image::read($physicalPath);
            $image->cover($width, $height);
            $image->save($newPath);

            // 7. Trả về đường dẫn chuẩn web của file đã resize để Controller lưu vào Database
            $webPathSmall = dirname($filePath) . '/' . $folderName . '/' . $fileName;
            return $webPathSmall;
        } catch (\Exception $e) {
            // Đổi lại text log cho đúng để dễ debug (bạn đang để "File delete error")
            Log::error("Image resize error: " . $e->getMessage() . '-----' . "line: " . $e->getLine());
            return null;
        }
    }
}
