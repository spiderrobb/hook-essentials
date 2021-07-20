import { useCallback, useEffect, useRef, useState } from "react";
// import { useLoader } from "./LoadManager";

function useAsyncCallback(callback, {
    defaultResult = undefined,
    autoCall = false,
    autoCallArgs = [],
    // disableLoaderManager = false,
} = {}) {
    const defaultResultRef = useRef();

    defaultResultRef.current = defaultResult;
    // setting up state for the async callback
    const [state, setState] = useState({ result: defaultResultRef.current, loading: autoCall, error: false });

    // creating fault tollorant callback supports all values of callback
    const wrappedCallback = useCallback(
        (...args) => {
            // first we get our raw Result
            const result = typeof callback === 'function' ? callback(...args) : callback;
            if (result instanceof Promise) {
                // result is promise then we do our loading and state handling
                setState({ result: defaultResultRef.current, loading: true, error: false });
                return result
                    .then(result => setState({ result, loading: false, error: false }))
                    .catch(error => setState({ result: defaultResultRef.current, loading: false, error }));
            }
            // if result is not a promise, just set state and return resolved promise no need for loading loop
            setState({ result, loading: false, error: false });
            return Promise.resolve(result);
        },
        [setState, callback, defaultResultRef]
    );

    // function for resetting
    const reset = useCallback(
        () => setState({ result: defaultResultRef.current, loading: false, error: false }),
        [setState, defaultResultRef]
    );

    // autoCall
    const autoCallArgsRef = useRef();
    autoCallArgsRef.current = autoCallArgs;
    useEffect(() => {
        if (autoCall) {
            wrappedCallback(...autoCallArgsRef.current);
        }
    }, [autoCall, wrappedCallback]);

    // set loading state
    // useLoader(!disableLoaderManager && state.loading);

    return {
        result: state.result,
        loading: state.loading,
        error: state.error,
        callback: wrappedCallback,
        reset,
    }
}

export default useAsyncCallback;
