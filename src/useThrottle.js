import { useCallback, useEffect, useRef } from 'react';

// delay=false - callback will be called exactly throttle miliseconds after throttle callback is called
// delay=true - callback will be called exactly throttle miliseconds after throttle callbacks most recent call
function useThrottle(callback, {
    throttle = 0,
    delay = false,
} = {}) {
    // there is some state to be maintained that should not re-render component
    const stateRef = useRef({
        args: null,
        interval: false
    });
    stateRef.current.callback = callback;
    stateRef.current.throttle = throttle;

    // when component unmounts make sure to clear timout
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            clearTimeout(stateRef.current.interval);
        }
    }, [stateRef]);

    // build throttled function
    const throttledFunction = useCallback(
        (...args) => {
            const { callback, throttle, interval } = stateRef.current;
            if (throttle > 0) {
                // if throttle > 0 then update args reference
                stateRef.current.args = args
                // if there is no interval set or if we are in a delayed throttle
                if (interval === false || delay) {
                    interval && clearTimeout(interval);
                    stateRef.current.interval = setTimeout(() => {
                        stateRef.current.interval = false;
                        callback(...stateRef.current.args);
                    }, throttle);
                    console.log(stateRef.current, stateRef.current.interval);
                }
            } else {
                // if delay <= 0 then the callback does not throttle
                callback(...args)
            }
        }, [stateRef, delay]
    );

    return {
        callback: throttledFunction,
        isPending: () => Boolean(stateRef.current.interval),
    };
}

export default useThrottle;
