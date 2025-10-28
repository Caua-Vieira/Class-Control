export interface TaskCreatedEvent {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    userEmail: string;
    userId: number;
}