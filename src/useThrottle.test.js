import { setupTestHook, act } from "./testUtils";
import useThrottle from "./useThrottle";

jest.useFakeTimers();

describe('useThrottle Hook', () => {
    const PARAMS = 'params';
    let hookState;
    let callback = jest.fn();
    beforeEach(() => {
        hookState = setupTestHook(useThrottle, [callback]);
    });

    test('initial state', () => {
        expect(hookState.callback).toBeTruthy();
        expect(hookState.isPending()).toBe(false);
    });

    test('calling useThrottle, when no throttle has been defined', () => {
        act(() => {
            hookState.callback(PARAMS);
        });

        expect(callback).toHaveBeenCalledWith(PARAMS)
        expect(hookState.isPending()).toBe(false);
    });

    describe('When throttle = 10, delay=false', () => {
        beforeEach(() => {
            act(() => {
                hookState.setArgs(callback, { throttle: 10, delay: false });
            });
        });

        test('callback is called in throttle seconds', () => {
            act(() => {
                hookState.callback(PARAMS);
            });

            expect(hookState.isPending()).toBe(true);
        });
    });
});
