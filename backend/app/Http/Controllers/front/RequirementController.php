<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    //
    public function index(Request $request)
    {
        $requirement = Requirement::where('course_id', $request->course_id)->orderBy('sort_order', "ASC")->get();
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $requirement
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
            'text' => "required|min:2",
            "course_id" => "required",
        ], [
            "text.required" => "truong nay la bat buoc",
            "text.min" => "toi thieu 2 ky tu",
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
            $requirement = new Requirement();

            $requirement->course_id = $request->course_id;
            $requirement->text = $request->text;
            $requirement->sort_order = 1000;
            $requirement->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $requirement,
                "message" => "create requirement successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error create requirement"
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
        $requirement = Requirement::find($id);
        if ($requirement === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "requirement not found"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'text' => "required|min:2",
        ], [
            "text.required" => "truong nay la bat buoc",
            "text.min" => "toi thieu 2 ky tu",
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


            $requirement->text = $request->text;
            $requirement->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $requirement,
                "message" => "update requirement successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error update requirement"
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $requirement = Requirement::find($id);
        if ($requirement === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "requirement not found"
            ], 404);
        }
        try {
            DB::beginTransaction();

            $requirement->delete();

            DB::commit();

            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "delete requirement successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error delete requirement"
            ], 401);
        }
    }


    public function sortOrderRequirement(Request $request)
    {
        if (!empty($request->dataUpdate)) {
            foreach ($request->dataUpdate as $key => $requirement) {
                Log::info("Gia tri cua key la: " . $key);
                Requirement::where('id', $requirement['id'])->update(['sort_order' => $key]);
            }

            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $request->dataUpdate,
                "message" => "Update sort-order requirement successfully"
            ], 200);
        }
        return response()->json([
            "status" => false,
            "code" => 404,
            "message" => "Update sort-order requirement not found"
        ], 404);
    }
}
