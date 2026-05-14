<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    //
    public function index(Request $request)
    {
        $lesson = Lesson::where('chapter_id', $request->chapter_id)->orderBy('sort_order', "ASC")->get();
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $lesson
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(), [
            'title' => "required|min:2",
            "chapter_id" => "required",
        ], [
            "title.required" => "truong nay la bat buoc",
            "title.min" => "toi thieu 2 ky tu",
            "chapter_id.required" => "Truong nay la bat buoc"
        ]);
        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 400,
                "errors" => $validator->errors(),
                "message" => "error field"
            ], 400);
        }
        try {
            DB::beginTransaction();
            $lesson = new Lesson();

            $lesson->chapter_id = $request->chapter_id;
            $lesson->title = $request->title;
            $lesson->sort_order = 1000;
            $lesson->status = $request->status;
            $lesson->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $lesson,
                "message" => "create lesson successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error create lesson"
            ], 401);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $lesson = Lesson::find($id);
        if ($lesson === null) {
            return response()->json([
                "status" => false,
                "code" => 404,
                "message" => "lesson not found",
            ], 404);
        }
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $lesson,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $lesson = Lesson::find($id);
        if ($lesson === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "lesson not found"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'title' => "required|min:2",
        ], [
            "title.required" => "truong nay la bat buoc",
            "title.min" => "toi thieu 2 ky tu",
        ]);
        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 400,
                "errors" => $validator->errors(),
                "message" => "error field"
            ], 400);
        }
        try {
            DB::beginTransaction();


            $lesson->chapter_id  = $request->chapter_id;
            $lesson->title = $request->title;
            $lesson->is_free_preview = $request->is_free_preview === false ? 'no' : 'yes';
            $lesson->duration = $request->duration;
            $lesson->description = $request->description;
            $lesson->status = $request->status;
            $lesson->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $lesson,
                "message" => "update lesson successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error update lesson"
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $lesson = Lesson::find($id);
        if ($lesson === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "lesson not found"
            ], 404);
        }
        try {
            DB::beginTransaction();

            $lesson->delete();

            DB::commit();

            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "delete lesson successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error delete lesson"
            ], 401);
        }
    }

    public function sortOrderLesson(Request $request)
    {
        if (!empty($request->lessons)) {
            foreach ($request->lessons as $key => $lesson) {
                Log::info("Gia tri cua key la: " . $key);
                Lesson::where('id', $lesson['id'])->update(['sort_order' => $key]);
            }

            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $request->lessons,
                "message" => "Update sort-order lesson successfully"
            ], 200);
        }
        return response()->json([
            "status" => false,
            "code" => 404,
            "message" => "Update sort-order lesson not found"
        ], 404);
    }
}
