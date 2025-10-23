<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization will be handled by policy
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:tasks,title',
            'description' => 'required|string',
            'status' => 'required|string|in:incomplete,inprogress,complete',
        ];
    }
}
