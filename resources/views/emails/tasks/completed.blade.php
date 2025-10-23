<!DOCTYPE html>
<html lang="en">

<body>
    <p>Hello {{ $userName }},</p>

    <h2>Task Completed</h2>

    <p><strong>Title:</strong> {{ $task->title }}</p>
    <p><strong>Description:</strong> {{ $task->description }}</p>
    <p><strong>Completed At:</strong> {{ $completedAt }}</p>

    <p>Thank you,<br>Your Task Management App</p>
</body>
</html>
