<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/show/{id}', [CourseController::class, 'show']);
    Route::put('/courses/update/{id}', [CourseController::class, 'update']);
    Route::get('/get-meta-data', [CourseController::class, 'metaData']);

    //outcome
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcome/create', [OutcomeController::class, 'store']);
    Route::put('/outcome/update/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcome/delete/{id}', [OutcomeController::class, 'destroy']);

    //requirement
    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirement/create', [RequirementController::class, 'store']);
    Route::put('/requirement/update/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirement/delete/{id}', [RequirementController::class, 'destroy']);
});
