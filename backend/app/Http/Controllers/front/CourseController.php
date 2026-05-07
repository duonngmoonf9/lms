<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Languages;
use App\Models\Level;
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
                "data" => $course,
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

    public function show($id)
    {
        $course = Course::find($id);
        if ($course === null) {
            return response()->json([
                "status" => false,
                "code" => 404,
                "message" => "course not found",
            ], 404);
        }
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $course,
        ], 200);
    }

    //get metaData category và language và level
    public function metaData()
    {
        $categories = Category::all();
        $languages = Languages::all();
        $levels = Level::all();

        return response()->json([
            "status" => true,
            "code" => 200,
            "categories" => $categories,
            "languages" => $languages,
            "levels" => $levels,
            "message" => "Get meta successfully",
        ], 200);
    }

    //update course full gia tri
    public function update($id, Request $request)
    {
        $course = Course::find($id);
        if ($course === null) {
            return response()->json([
                "status" => false,
                "code" => 404,
                "message" => "course not found",
            ], 404);
        }
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                "title" => "required|min:2",
                "category_id" => "required",
                "language_id" => "required",
                "level_id" => "required",
                "price" => "required",
            ], [
                "title.required" => "truong nay la bat buoc",
                "title.min" => "It nhat 2 ky tu",
                "category_id.required" => "truong nay la bat buoc",
                "language_id.required" => "truong nay la bat buoc",
                "level_id.required" => "truong nay la bat buoc",
                "price.required" => "truong nay la bat buoc",
            ]);
            if ($validator->fails()) {
                return response()->json([
                    "status" => false,
                    "code" => 400,
                    "message" => "field error",
                    "errors" => $validator->errors()
                ], 400);
            }
            $dataRequest = $request->all();
            $course->fill($dataRequest);
            $course->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $dataRequest,
                "message" => "Update course successfully",
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message : " . $e->getMessage() . "----------------- line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "Update course error",
            ], 401);
        }
    }
}
