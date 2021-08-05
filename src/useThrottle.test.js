import { setupTestHook, act } from "./testUtils";
import useThrottle from "./useThrottle";

describe('useThrottle Hook', () => {
    const PARAMS1 = 'params1';
    const PARAMS2 = 'params2';
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
        hookState.callback(PARAMS1);

        expect(callback).toHaveBeenCalledWith(PARAMS1)
        expect(hookState.isPending()).toBe(false);
    });

    test('When throttle = 100, delay=false', () => {
        jest.useFakeTimers();
        act(() => {
            hookState.setArgs(callback, { throttle: 100, delay: false });
        })
        hookState.callback(PARAMS1);

        expect(hookState.isPending()).toBe(true);
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(clearTimeout.mock.calls.length).toBe(0);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);
        hookState.callback(PARAMS2);

        expect(hookState.isPending()).toBe(true);
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(clearTimeout.mock.calls.length).toBe(0);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);

        expect(hookState.isPending()).toBe(false);
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(clearTimeout.mock.calls.length).toBe(0);
        expect(callback).toHaveBeenCalledWith(PARAMS2);
    });

    test('when throttle = 100, delay=true', () => {
        jest.useFakeTimers();
        act(() => {
            hookState.setArgs(callback, { throttle: 100, delay: true });
        });
        hookState.callback(PARAMS1);

        expect(hookState.isPending()).toBe(true);
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(clearTimeout.mock.calls.length).toBe(0);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);
        hookState.callback(PARAMS2);

        expect(hookState.isPending()).toBe(true);
        expect(setTimeout.mock.calls.length).toBe(2);
        expect(clearTimeout.mock.calls.length).toBe(1);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);

        expect(hookState.isPending()).toBe(true);
        expect(setTimeout.mock.calls.length).toBe(2);
        expect(clearTimeout.mock.calls.length).toBe(1);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);

        expect(hookState.isPending()).toBe(false);
        expect(setTimeout.mock.calls.length).toBe(2);
        expect(clearTimeout.mock.calls.length).toBe(1);
        expect(callback).toHaveBeenCalledWith(PARAMS2);
    });
});
