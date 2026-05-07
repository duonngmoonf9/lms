<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    //
    public function index() {}

    // phuong thuc nay se luu tru bang nhap vao database
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|min:2"
        ], [
            "title.required" => "truong nay la bat buoc",
            "title.min" => "It nhat 2 ky tu"
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 400,
                "message" => "field error",
                "errors" => $validator->errors()
            ], 400);
        }

        try {
            DB::beginTransaction();
            $course = new Course();
            $course->title = $request->title;
            $course->status = 0;
            $course->user_id = $request->user()->id;

            $course->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "Create course successfully",
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "Create course error",
            ], 401);
        }
    }
}
