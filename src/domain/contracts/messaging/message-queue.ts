export abstract class MessageQueue {
    abstract publish(queue: string, message: any): Promise<void>;
}
