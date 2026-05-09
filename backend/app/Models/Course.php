<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    //
    protected $guarded = [];
    protected $appends = ['image_path_small'];

    function getImagePathSmallAttribute()
    {
        if (is_null($this->image_path)) {
            return "";
        }
        $dir = dirname($this->image_path);
        $fileName = basename($this->image_path);

        $smallPath = $dir . '/small/' . $fileName;

        // Dùng hàm asset() để thêm domain thật (VD: http://localhost:8000/storage/...)
        return asset($smallPath);
    }
}
