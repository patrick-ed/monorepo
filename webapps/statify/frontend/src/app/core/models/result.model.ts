abstract class ResultState {
    abstract readonly status: 'loading' | 'success' | 'error' | 'idle';
}

export class Loading extends ResultState {
    readonly status = 'loading';
}

export class Idle extends ResultState {
    readonly status = 'idle';
}

export class Error extends ResultState {
    readonly status = 'error';
    constructor(public readonly error: any) {
        super();
    }
}

export class Success<T> extends ResultState {
    readonly status = 'success';
    constructor(public readonly data: T) {
        super();
    }
}

export type Result<T> = Idle | Loading | Error | Success<T>;