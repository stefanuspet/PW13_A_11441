<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($id)
    {
        $review = Review::where('id_content', $id)->with('user')->get();
        if (!$review) {
            return response([
                'message' => 'Review Not Found',
                'data' => null
            ], 404);
        }
        return response([
            'message' => 'Show Review Success',
            'data' => $review
        ], 200);
    }

    public function store(Request $request, $id)
    {
        $storeData = $request->all();

        $validate = Validator::make($storeData, [
            'comment' => 'required',
        ]);
        if ($validate->fails()) {
            return response(['message' => $validate->errors()], 400);
        }
        $idUser = Auth::user()->id;
        $storeData['id_user'] = $idUser;
        $storeData['id_content'] = $id;
        $review = Review::create($storeData);
        return response([
            'message' => 'Add Review Success',
            'data' => $review
        ], 200);
    }

    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response([
                'message' => 'Review Not Found',
                'data' => null
            ], 404);
        }
        $review->delete();
        return response([
            'message' => 'Delete Review Success',
            'data' => $review
        ], 200);
    }

    public function getUserId()
    {
        $user = Auth::user()->id;
        return response([
            'message' => 'Get User Id Success',
            'data' => $user
        ], 200);
    }
}
