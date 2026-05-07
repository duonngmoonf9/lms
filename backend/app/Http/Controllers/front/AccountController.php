<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:3',
        ], [
            'name.required' => 'Truong name khong duoc de trong',
            'name.min' => 'Truong name phai lon hon 2 ki tu',
            'password.required' => 'Truong password khong duoc de trong',
            'password.min' => 'Truong password phai lon hon 3 ki tu',
            'email.required' => 'Truong email khong duoc de trong',
            'email.unique' => 'Email da ton tai',
            'email.email' => 'Email khong hop le',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'code' => 400,
                'message' => 'field error',
                'errors' => $validator->errors()
            ], 400);
        } else {
            try {
                DB::beginTransaction();
                $user = new User();
                $data = $request->only(['name', 'email']);
                $data['password'] = Hash::make($request->password);
                $user->create($data);
                DB::commit();
                return response()->json([
                    'status' => true,
                    'code' => 200,
                    'message' => 'create account successfully'
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("message " . $e->getMessage() . "------------ line: " . $e->getLine());
                return response()->json([
                    'status' => false,
                    'code' => 400,
                    'message' => 'create account error'
                ], 400);
            }
        }
    }

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Truong email khong duoc de trong',
            'email.email' => 'Email khong hop le',
            'password.required' => 'Truong password khong duoc de trong',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'code' => 400,
                'message' => 'field error',
                'errors' => $validator->errors()
            ], 400);
        } else {
            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = User::find(Auth::user()->id);
                //khoi tao token
                $token = $user->createToken('token')->plainTextToken;

                return response()->json([
                    'status' => true,
                    'code' => 200,
                    'token' => $token,
                    'user' => $user,
                    'message' => 'login success',
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'code' => 401,
                    'message' => 'email hoac pass khong dung',
                ], 401);
            }
        }
    }

    public function getAccount() {}
}
