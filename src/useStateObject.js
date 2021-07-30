import { useCallback, useRef, useState } from "react";

const DEFAULT_INITIAL_VALUE = {};

function mergeSet(initialValue, ...updateRequest) {
    const updateIntent = updateRequest.pop();
    const [step = undefined, ...path] = updateRequest;
    if (step !== undefined) {
        return mergeUpdate(initialValue, {
            [step]: mergeSet(initialValue[step], ...path, updateIntent)
        });
    }
    if (updateIntent.constructor.name === 'SyntheticBaseEvent') {
        const { target: { name, value, type, checked } } = updateIntent;
        return {
            [name]: type === 'checkbox' ? checked : value,
        };
    }
    return typeof updateIntent === 'function'
        ? updateIntent(initialValue)
        : updateIntent;
}
function mergeUpdate(initialValue, ...updateRequest) {
    const updateIntent = updateRequest.pop();
    const [step = undefined, ...path] = updateRequest;
    if (step !== undefined) {
        if (Array.isArray(initialValue)) {
            const result = [...initialValue];
            result[step] = mergeUpdate(initialValue[step], ...path, updateIntent);
            return result;
        }
        return mergeUpdate(initialValue, {
            [step]: mergeUpdate(initialValue[step], ...path, updateIntent)
        });
    }
    return {
        ...initialValue,
        ...mergeSet(initialValue, updateIntent)
    };
}
function mergeSetCallback(...update) {
    return initialValue => mergeSet(initialValue, ...update);
}
function mergeUpdateCallback(...update) {
    return initialValue => mergeUpdate(initialValue, ...update);
}
function useStateObject(initialValue = DEFAULT_INITIAL_VALUE) {
    // code to manage initial Value ref
    const initialValueRef = useRef(initialValue);
    const setInitialValue = useCallback(
        (...update) => initialValueRef.current = mergeSet(initialValueRef.current, ...update),
        [initialValueRef]
    );
    const updateInitialValue = useCallback(
        (...update) => initialValueRef.current = mergeUpdate(initialValueRef.current, ...update),
        [initialValueRef]
    );
    const clearInitialValue = useCallback(
        () => initialValueRef.current = {},
        [initialValueRef]
    );

    // code to manage current state
    const [state, baseSetState] = useState(initialValue);
    const stateRef = useRef(state);
    const setState = useCallback(
        (...update) => baseSetState(previousState => {
            const newState = mergeSet(previousState, ...update);
            stateRef.current = newState;
            return newState;
        }),
        [baseSetState]
    )
    const updateState = useCallback(
        (...update) => setState(mergeUpdateCallback(...update)),
        [setState]
    );
    const resetState = useCallback(
        () => setState(initialValueRef.current),
        [setState, initialValueRef]
    );
    const clearState = useCallback(() => setState({}), [setState]);

    // insightful helpers, TODO: add option for deep compare
    const isDirty = useCallback(
        () => initialValueRef.current !== stateRef.current,
        [initialValueRef, stateRef]
    );

    return {
        // initial value interface
        initialValueRef,
        initialValue: initialValueRef.current,
        setInitialValue,
        updateInitialValue,
        clearInitialValue,

        // state interface
        stateRef,
        state,
        setState,
        updateState,
        resetState,
        clearState,

        // helpers
        isDirty,
    };
}

export default useStateObject;
export {
    mergeSet,
    mergeSetCallback,
    mergeUpdate,
    mergeUpdateCallback,
};
