<!DOCTYPE html>
<html lang="en">

<body>
    <p>Hello {{ $userName }},</p>
    
    <h2>Task Created</h2>

    <p><strong>Title:</strong> {{ $task->title }}</p>
    <p><strong>Description:</strong> {{ $task->description }}</p>
    <p><strong>Status:</strong> {{ ucfirst($task->status) }}</p>

    <p>Thank you,<br>Your Task Management App</p>
</body>
</html>
