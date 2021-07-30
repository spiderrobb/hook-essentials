import { useCallback } from "react";
import useAsyncCallback from "./useAsyncCallback";
import useStateObject from "./useStateObject";

function useFormState({
    id = false,
    onGet,
    onCreate,
    onUpdate,
    onSave,
    autoLoad = true,
    overwriteOnLoad = false,
    defaultFormState = {},
}) {
    // flags
    const isNewRecord = !id;
    const fetchRecord = id && onGet && autoLoad;

    // form state
    const {
        // initial value interface
        initialValueRef,
        initialValue,
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
    } = useStateObject(defaultFormState);

    const asyncFetch = useCallback(
        () => {
            return id && onGet(id)
                .then(result => {
                    if (overwriteOnLoad) {
                        setInitialValue(result);
                    } else {
                        updateInitialValue(result);
                    }
                    resetState();
                })
        },
        [id, onGet, overwriteOnLoad, setInitialValue, updateInitialValue, resetState]
    );
    const {
        callback: reload,
        loading,
        error: loadError,
        reset: clearLoadError,
    } = useAsyncCallback(asyncFetch, { autoCall: fetchRecord })

    const asyncSave = useCallback(
        () => (
            id
                ? onUpdate(id, stateRef.current)
                : onCreate(stateRef.current)
        ).then(onSave)
        ,
        [id, onCreate, onUpdate, onSave, stateRef]
    );
    const {
        callback: save,
        loading: saving,
        error: saveError,
        reset: clearSaveError
    } = useAsyncCallback(asyncSave);

    const updating = Boolean(saving && id);
    const creating = Boolean(saving && !id);
    const loadState = (loading && 'loading')
        || (updating && 'updating')
        || (creating && 'creating')
        || 'idle';

    return {
        // Form State
        // initial value interface
        initialValueRef,
        initialValue,
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

        // loading
        reload,
        loading,
        loadError,
        clearLoadError,

        // saving
        save,
        saving,
        updating,
        creating,
        saveError,
        clearSaveError,

        // helpers
        isNewRecord,
        isDirty,
        loadState,
    }
}

export default useFormState;
