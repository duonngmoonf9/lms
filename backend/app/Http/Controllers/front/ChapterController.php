<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Traits\StorageImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    //
    use StorageImage;
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)->orderBy('sort_order', "ASC")->get();
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $chapters
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
            "course_id" => "required",
        ], [
            "title.required" => "truong nay la bat buoc",
            "title.min" => "toi thieu 2 ky tu",
            "course_id.required" => "truong nay la bat buoc"
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
            $chapter = new Chapter();

            $chapter->course_id = $request->course_id;
            $chapter->title = $request->title;
            $chapter->sort_order = 1000;
            $chapter->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $chapter,
                "message" => "create chapter successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error create chapter"
            ], 401);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $chapter = Chapter::find($id);
        if ($chapter === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "chapter not found"
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


            $chapter->title = $request->title;
            $chapter->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $chapter,
                "message" => "update chapter successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error update chapter"
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $chapter = Chapter::find($id);
        if ($chapter === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "chapter not found"
            ], 404);
        }
        try {
            DB::beginTransaction();
            foreach ($chapter->Lessons as $lesson) {
                // 2. Kiểm tra nếu lesson có video thì tiến hành xóa folder
                if (!empty($lesson->video_path)) {
                    $this->folderDelete($lesson->video_path);
                }
            }
            $chapter->delete();

            DB::commit();

            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "delete chapter successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error delete chapter"
            ], 401);
        }
    }

    public function sortOrderChapter(Request $request)
    {
        if (!empty($request->chapters)) {
            foreach ($request->chapters as $key => $chapter) {
                Log::info("Gia tri cua key la: " . $key);
                Chapter::where('id', $chapter['id'])->update(['sort_order' => $key]);
            }

            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $request->chapters,
                "message" => "Update sort-order chapter successfully"
            ], 200);
        }
        return response()->json([
            "status" => false,
            "code" => 404,
            "message" => "Update sort-order chapter not found"
        ], 404);
    }
}
