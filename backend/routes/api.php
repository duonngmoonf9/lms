<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
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
});
