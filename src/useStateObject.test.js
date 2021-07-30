import { fireEvent } from "@testing-library/react";
import React from "react";
import { act, setupTestComponent, setupTestHook, screen } from "./testUtils";
import useStateObject from "./useStateObject";

function setupFormStateObject() {
    const result = {};
    function Wrapper() {
        const { state, updateState } = useStateObject({
            text: 'hello world',
            select: 'option1',
            checkbox: true,
        });
        result.state = state;
        return (
            <React.Fragment>
                <input
                    name="text"
                    value={state.text}
                    onChange={updateState}
                    data-testid="text"
                />
                <select
                    name="select"
                    value={state.select}
                    onChange={updateState}
                    data-testid="select"
                >
                    <option value="option1">option1</option>
                    <option value="option2">option2</option>
                </select>
                <input
                    name="checkbox"
                    type="checkbox"
                    checked={state.checkbox}
                    onChange={updateState}
                    data-testid="checkbox"
                />
            </React.Fragment>
        );
    }
    setupTestComponent(Wrapper);
    return result;
}

describe('useStateObject Hook', () => {
    let hookState;
    const initialValue = {};
    beforeEach(() => {
        hookState = setupTestHook(useStateObject, [initialValue]);

        // assert initial state
        expect(hookState.initialValue).toBe(initialValue);
        expect(hookState.initialValueRef.current).toBe(hookState.initialValue);
        expect(hookState.state).toEqual(initialValue);
        expect(hookState.stateRef.current).toEqual(hookState.state);
        expect(hookState.isDirty()).toEqual(false);
    });

    test('replace state', () => {
        const newState = { modified: 'state' };
        act(() => {
            hookState.setState(newState);
        });

        // assert that state has been replaced
        expect(hookState.state).toBe(newState);
        expect(hookState.stateRef.current).toBe(newState);
        expect(hookState.isDirty()).toBe(true);
    });

    test('update state', () => {
        const newState = { modified: 'state' };
        act(() => {
            hookState.updateState(newState);
        });

        // assert that state has been updated
        expect(hookState.state).not.toBe(newState);
        expect(hookState.state).toEqual(newState);
        expect(hookState.stateRef.current).toBe(hookState.state);
        expect(hookState.isDirty()).toBe(true);
    });

    test('replace initial value', () => {
        const newInitialValue = { modified: 'state' };
        act(() => {
            hookState.setInitialValue(newInitialValue);
        });

        // updates to initialValue do not cause re-renders
        expect(hookState.initialValue).not.toBe(newInitialValue);
        // ref will be updated though
        expect(hookState.initialValueRef.current).toBe(newInitialValue);
        expect(hookState.isDirty()).toBe(true);
    });

    test('update initial value', () => {
        const newInitialValue = { modified: 'state' };
        act(() => {
            hookState.updateInitialValue(newInitialValue);
        });

        expect(hookState.initialValue).not.toBe(newInitialValue);
        expect(hookState.initialValueRef.current).toEqual(newInitialValue);
        expect(hookState.isDirty()).toBe(true);
    });

    describe('clearing and reseting state', () => {
        beforeEach(() => {
            act(() => {
                hookState.setState({ modified: 'state' });
            });

            // assert initial state
            expect(hookState.isDirty()).toBe(true);
            expect(hookState.state).toEqual({ modified: 'state' });
        });

        test('reset state', () => {
            act(() => {
                hookState.resetState();
            });

            // assert state has been reset
            expect(hookState.state).toBe(hookState.initialValue);
        });

        test('clear state', () => {
            act(() => {
                hookState.clearState();
            });

            // assert state has been cleared
            expect(hookState.state).toEqual({});
        });
    });
});

describe('Handling Forms', () => {
    let componentState;
    beforeEach(() => {
        componentState = setupFormStateObject();
    });

    test('Initial State', () => {
        expect(componentState.state).toEqual({
            checkbox: true,
            select: 'option1',
            text: 'hello world',
        });
    });

    test('Modifying Text input', () => {
        act(() => {
            fireEvent.change(screen.queryByTestId('text'), {
                target: {
                    value: 'Say What?'
                }
            });
        });

        expect(componentState.state.text).toBe('Say What?');
    });

    test('Modifying Select Input', () => {
        act(() => {
            fireEvent.change(screen.queryByTestId('select'), {
                target: {
                    value: 'option2'
                }
            });
        });

        expect(componentState.state.select).toBe('option2');
    });

    test('Modifying Checkbox Input', () => {
        act(() => {
            fireEvent.click(screen.queryByTestId('checkbox'));
        });

        expect(componentState.state.checkbox).toBe(false);
    });
})
