abstract class ResultState {
}

export class Idle extends ResultState {
}

export class Loading extends ResultState {
}

export class Error extends ResultState {
    constructor(public readonly error: any) {
        super();
    }
}

export class Success<T> extends ResultState {
    constructor(public readonly data: T) {
        super();
    }
}

export type Result<T> = Idle | Loading | Error | Success<T>;