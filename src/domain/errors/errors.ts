export class NotFoundException extends Error {
    public readonly name: string = 'Internal Error';
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}

export class DatabaseException extends Error {
    public readonly name: string = 'Database Error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, DatabaseException.prototype);
    }
}

export class InvalidCredentialsException extends Error {
    public readonly name: string = 'Invalid Credentials Error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    }
}
export class MessageQueueException extends Error {
    public readonly name: string = 'Message Queue Error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    }
}
export class QueueProcessingException extends Error {
    public readonly name: string = 'Queue Processing Error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    }
}

export class EmailSendException extends Error {
    public readonly name: string = 'Email Send Error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    }
}