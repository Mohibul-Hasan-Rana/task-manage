<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization will be handled by policy
    }

    public function rules(): array
    {
        return [
             'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tasks', 'title')->ignore($this->task->id),
            ],
            'description' => 'required|string',
            'status' => 'required|string|in:incomplete,complete',
        ];
    }
}
