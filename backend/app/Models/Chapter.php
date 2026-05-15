<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    //
    public function Lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order', "ASC");
    }
}
