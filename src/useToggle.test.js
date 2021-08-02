import { setupTestHook, act } from "./testUtils";
import useToggle from "./useToggle";

describe('useToggle Hook', () => {
    let hookState;
    beforeEach(() => {
        hookState = setupTestHook(useToggle);
    });

    test('Initial State', () => {
        expect(hookState.value).toBe(false);
        expect(hookState.toggle).toBeTruthy();
        expect(hookState.setTrue).toBeTruthy();
        expect(hookState.setFalse).toBeTruthy();
    });

    describe('When Toggling', () => {
        beforeEach(() => {
            act(() => {
                hookState.toggle();
            });
        });

        test('when value is false toggle will change to true.', () => {
            expect(hookState.value).toBe(true);
        });

        test('when value is true toggle will change to false', () => {
            act(() => {
                hookState.toggle();
            });
            expect(hookState.value).toBe(false);
        })
    });

    describe('Specific Toggle States', () => {
        test('set toggle state', () => {
            act(() => {
                hookState.setTrue();
            });
            expect(hookState.value).toBe(true);

            act(() => {
                hookState.setFalse();
            });
            expect(hookState.value).toBe(false);
        })
    });
})
