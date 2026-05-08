<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $outcome = Outcome::where('course_id', $request->course_id)->orderBy('sort_order', "ASC")->get();
        return response()->json([
            "status" => true,
            "code" => 200,
            "data" => $outcome
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
            $outcome = new Outcome();

            $outcome->course_id = $request->course_id;
            $outcome->text = $request->text;
            $outcome->sort_order = 1000;
            $outcome->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $outcome,
                "message" => "create outcome successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error create outcome"
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
        $outcome = Outcome::find($id);
        if ($outcome === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "outcome not found"
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


            $outcome->text = $request->text;
            $outcome->save();
            DB::commit();
            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $outcome,
                "message" => "update outcome successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error update outcome"
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $outcome = Outcome::find($id);
        if ($outcome === null) {
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "outcome not found"
            ], 404);
        }
        try {
            DB::beginTransaction();

            $outcome->delete();

            DB::commit();

            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "delete outcome successfully"
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage() . "----------- Line: " . $e->getLine());
            return response()->json([
                "status" => false,
                "code" => 401,
                "message" => "error delete outcome"
            ], 401);
        }
    }

    public function sortOrderOutcome(Request $request)
    {
        if (!empty($request->outcomes)) {
            foreach ($request->outcomes as $key => $outcome) {
                Log::info("Gia tri cua key la: " . $key);
                Outcome::where('id', $outcome['id'])->update(['sort_order' => $key]);
            }

            return response()->json([
                "status" => true,
                "code" => 200,
                "data" => $request->outcomes,
                "message" => "Update sort-order outcome successfully"
            ], 200);
        }
        return response()->json([
            "status" => false,
            "code" => 404,
            "message" => "Update sort-order outcome not found"
        ], 404);
    }
}
