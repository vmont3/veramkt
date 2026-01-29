import { useRef } from 'react';

export type noop = (...args: any[]) => any;

function usePersistFn<T extends noop>(fn: T) {
    const ref = useRef<any>(() => {
        throw new Error('Cannot call function while rendering.');
    });

    ref.current = fn;

    const persistFn = useRef<any>();
    if (!persistFn.current) {
        persistFn.current = function (this: any, ...args: any[]) {
            return ref.current.apply(this, args);
        };
    }

    return persistFn.current as T;
}

export { usePersistFn };
