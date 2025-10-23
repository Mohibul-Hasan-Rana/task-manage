export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    user: {
        id: number;
        name: string;
    };
}

export type TaskStatus = 'incomplete' | 'complete';

export interface TaskFormData extends Record<string, string> {
    title: string;
    description: string;
    status: TaskStatus;
}
