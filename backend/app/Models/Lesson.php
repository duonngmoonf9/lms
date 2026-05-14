<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    //
    protected $appends = ['video_path_url'];

    function getVideoPathUrlAttribute()
    {
        if (is_null($this->video_path)) {
            return "";
        }

        // Dùng hàm asset() để thêm domain thật (VD: http://localhost:8000/storage/...)
        return asset($this->video_path);
    }
}
