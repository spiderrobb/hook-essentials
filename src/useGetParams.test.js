import { setupTestHook, act } from './testUtils';
import useGetParams from "./useGetParams";

describe('useGetParams Hook', () => {
    let hookState;
    beforeEach(() => {
        hookState = setupTestHook(useGetParams, [], {
            initialEntries: ['?test=foo&bar=baz']
        });
    });

    test('initialState', () => {
        expect(hookState.params).toEqual({
            test: 'foo',
            bar: 'baz',
        });
        expect(hookState.paramRef.current).toEqual({
            test: 'foo',
            bar: 'baz',
        });
    });

    test('setPushParams', () => {
        act(() => {
            hookState.setPushParams({
                crispy: 'taco',
            });
        });

        expect(hookState.history.entries.length).toBe(2);
        expect(hookState.params).toEqual({
            crispy: 'taco',
        });
        expect(hookState.paramRef.current).toEqual({
            crispy: 'taco',
        });
    });

    test('updatePushParams', () => {
        act(() => {
            hookState.updatePushParams({
                crispy: 'taco',
            });
        });

        expect(hookState.history.entries.length).toBe(2);
        expect(hookState.params).toEqual({
            crispy: 'taco',
            test: 'foo',
            bar: 'baz',
        });
        expect(hookState.paramRef.current).toEqual({
            crispy: 'taco',
            test: 'foo',
            bar: 'baz',
        });
    });

    test('setReplaceParams', () => {
        act(() => {
            hookState.setReplaceParams({
                crispy: 'taco',
            });
        });

        expect(hookState.history.entries.length).toBe(1);
        expect(hookState.params).toEqual({
            crispy: 'taco',
        });
        expect(hookState.paramRef.current).toEqual({
            crispy: 'taco',
        });
    });

    test('updateReplaceParams', () => {
        act(() => {
            hookState.updateReplaceParams({
                crispy: 'taco',
            });
        });

        expect(hookState.history.entries.length).toBe(1);
        expect(hookState.params).toEqual({
            crispy: 'taco',
            test: 'foo',
            bar: 'baz',
        });
        expect(hookState.paramRef.current).toEqual({
            crispy: 'taco',
            test: 'foo',
            bar: 'baz',
        });
    });
});
