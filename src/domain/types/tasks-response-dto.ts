export interface TasksResponseDTO {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    user: string;
    createdAt: Date
}