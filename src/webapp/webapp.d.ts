//interface Callback<T>

declare type CallbackError = string | Error | null | undefined;

declare type Callback<T> = (err: CallbackError, data?: T) => void;