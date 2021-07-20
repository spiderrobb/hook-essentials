import useAsyncCallback from './useAsyncCallback';

describe('useAsyncCallback hook', () => {
    let hookState;
    let method;
    beforeEach(() => {
        method = asyncFn();
        hookState = setupTestHook(useAsyncCallback, [method]);
    });

    test('expected initial state', () => {
        expect(hookState.result).toBe(undefined);
        expect(hookState.loading).toBe(false);
        expect(hookState.error).toBe(false);
        expect(hookState.callback).toBeTruthy();
        expect(hookState.reset).toBeTruthy();
        expect(method).toHaveBeenCalledTimes(0);
    });

    test('when autoCall=true async callback is called with autoCallArgs', () => {
        act(() => {
            hookState.setArgs(method, {
                autoCall: true,
                autoCallArgs: [1, 'happy', true]
            });
        });

        expect(method).toHaveBeenCalledTimes(1);
        expect(method).toHaveBeenCalledWith(1, 'happy', true);
        expect(hookState.loading).to
    });

    test('handles non promise results without loading state', () => {
        act(() => {
            hookState.setArgs('non-function');
        });
        act(() => {
            hookState.callback();
        });

        expect(hookState.result).toBe('non-function');
        expect(hookState.loading).toBe(false);
        expect(hookState.error).toBe(false);

        act(() => {
            hookState.setArgs(() => 'function');
        });
        act(() => {
            hookState.callback();
        });

        expect(hookState.result).toBe('function');
        expect(hookState.loading).toBe(false);
        expect(hookState.error).toBe(false);
    });

    describe('when async callback is called', () => {
        beforeEach(() => {
            act(() => {
                hookState.callback();
            });
        });

        test('displays loading state', () => {
            expect(hookState.result).toBe(undefined);
            expect(hookState.loading).toBe(true);
            expect(hookState.error).toBe(false);
            expect(method).toHaveBeenCalledTimes(1);
        });

        describe('when async method is resolved', () => {
            const resolvedResponse = { success: true };
            beforeEach(
                () => act(
                    () => method.resolve(resolvedResponse)
                )
            );

            test('displays resolved state', () => {
                expect(hookState.result).toBe(resolvedResponse);
                expect(hookState.loading).toBe(false);
                expect(hookState.error).toBe(false);
            });

            test('result is cleared when reset to defaultResult when reset', () => {
                act(() => {
                    hookState.reset();
                });

                expect(hookState.resut).toBe(undefined);
                expect(hookState.loading).toBe(false);
                expect(hookState.error).toBe(false);
            });
        });

        describe('when async method is rejected', () => {
            const rejectedResponse = { success: false };
            beforeEach(
                () => act(
                    () => method.reject(rejectedResponse).catch(() => null)
                )
            );

            test('displays error state', () => {
                expect(hookState.result).toBe(undefined);
                expect(hookState.loading).toBe(false);
                expect(hookState.error).toBe(rejectedResponse);
            });
        });
    });
});
