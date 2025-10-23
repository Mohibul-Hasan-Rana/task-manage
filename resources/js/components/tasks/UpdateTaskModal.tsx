import React from 'react';
import { router } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';
import { Task, TaskStatus } from '@/types/task';

interface UpdateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

// Using a wrapper component to force re-render when task changes
const UpdateTaskModal: React.FC<UpdateTaskModalProps> = (props) => {
    if (!props.task) return null;
    return <UpdateTaskModalContent key={props.task.id} {...props} />;
};

const UpdateTaskModalContent: React.FC<UpdateTaskModalProps> = ({ isOpen, onClose, task }) => {
    const [formData, setFormData] = React.useState({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: (task?.status ?? 'incomplete') as TaskStatus,
    });

    const renderStatusLabel = (status: TaskStatus) => {
        switch (status) {
            case 'inprogress':
                return 'In Progress';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    if (!task) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-medium">Update Task</Dialog.Title>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            {renderStatusLabel(formData.status)}
                        </span>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (task && task.status !== 'complete') {
                            router.put(`/tasks/${task.id}`, formData, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    onClose();
                                },
                                onError: () => {
                                    // errors will be provided via Inertia props; no-op here
                                }
                            });
                        }
                    }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${task.status === 'complete' ? 'bg-gray-50' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    readOnly={task.status === 'complete'}
                                    disabled={task.status === 'complete'}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${task.status === 'complete' ? 'bg-gray-50' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    readOnly={task.status === 'complete'}
                                    disabled={task.status === 'complete'}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                {task.status === 'complete' ? (
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                                        value={formData.status}
                                        readOnly
                                        disabled
                                    />
                                ) : (
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.status}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                    >
                                        <option value="incomplete">To do</option>
                                        <option value="inprogress">In progress</option>
                                        <option value="complete">Done</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={onClose}
                            >
                                {task.status === 'complete' ? 'Close' : 'Cancel'}
                            </button>
                            {task.status !== 'complete' && (
                                <button
                                    type="submit"
                                    className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                                >
                                    Update Task
                                </button>
                            )}
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default UpdateTaskModal;
