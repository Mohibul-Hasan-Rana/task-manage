<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'status', 'user_id'];

    public const STATUS_INCOMPLETE = 'incomplete';
    public const STATUS_INPROGRESS = 'inprogress';
    public const STATUS_COMPLETE = 'complete';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($task) {
            if (!isset($task->status)) {
                $task->status = self::STATUS_INCOMPLETE;
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
