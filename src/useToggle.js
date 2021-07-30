import { useState, useCallback } from 'react';

function useToggle(defaultValue = false, { trueValue = true, falseValue = false } = {}) {
    const [value, setValue] = useState(defaultValue);
    const toggle = useCallback(
        () => setValue(
            previousValue => previousValue === trueValue
                ? falseValue
                : trueValue
        ),
        [setValue, trueValue, falseValue]
    );
    const setTrue = useCallback(() => setValue(trueValue), [setValue, trueValue]);
    const setFalse = useCallback(() => setValue(falseValue), [setValue, falseValue]);
    return { value, toggle, setTrue, setFalse };
}

export default useToggle;
