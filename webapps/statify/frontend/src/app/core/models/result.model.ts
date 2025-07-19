abstract class ResultState {
    abstract readonly status: Status
}

export class Loading extends ResultState {
    readonly status = Status.LOADING;
}

export class Idle extends ResultState {
    readonly status = Status.IDLE;
}

export class Error extends ResultState {
    readonly status = Status.ERROR;
    constructor(public readonly error: any) {
        super();
    }
}

export class Success<T> extends ResultState {
    readonly status = Status.SUCCESS;
    constructor(public readonly data: T) {
        super();
    }
}

export enum Status {
    SUCCESS = 'success',
    ERROR = 'error',
    LOADING = 'loading',
    IDLE = 'idle',
}

export type Result<T> = Idle | Loading | Error | Success<T>;