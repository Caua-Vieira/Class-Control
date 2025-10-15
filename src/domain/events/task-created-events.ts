export interface TaskCreatedEvent {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    userId: number;
}