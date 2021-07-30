import { act, setupTestHook, asyncFn } from "./testUtils";
import useFormState from "./useFormState";
import { mergeUpdate } from "./useStateObject";


describe('useFormState hook', () => {
    let hookState;
    beforeEach(() => {
        let hookArgs = {
            onGet: asyncFn(),
            onCreate: asyncFn(),
            onUpdate: asyncFn(),
            onSave: asyncFn(),
            defaultFormState: {
                name: '',
                age: 0,
            }
        }
        hookState = setupTestHook(useFormState, [hookArgs]);
        hookState.updateArgs = update => {
            hookArgs = mergeUpdate(hookArgs, update);
            hookState.setArgs(hookArgs)
        };
    });

    test('Initial hook state', () => {
        expect(hookState.state).toEqual({
            name: '',
            age: 0,
        });
        expect(hookState.initialValue).toEqual({
            name: '',
            age: 0,
        });
        expect(hookState.loadState).toBe('idle');
        expect(hookState.isDirty()).toBe(false);
        expect(hookState.isNewRecord).toBe(true);
        expect(hookState.loading).toBe(false);
        expect(hookState.saving).toBe(false);
        expect(hookState.creating).toBe(false);
        expect(hookState.updating).toBe(false);
        expect(hookState.hookArgs[0].onGet).toHaveBeenCalledTimes(0);
        expect(hookState.hookArgs[0].onGet.pending).toBe(false);
        expect(hookState.hookArgs[0].onCreate).toHaveBeenCalledTimes(0);
        expect(hookState.hookArgs[0].onUpdate).toHaveBeenCalledTimes(0);
        expect(hookState.hookArgs[0].onSave).toHaveBeenCalledTimes(0);
        expect(hookState.loadError).toBe(false);
        expect(hookState.saveError).toBe(false);
    });

    describe('when loading record', () => {
        describe('with overwriteOnLoad=false', () => {
            beforeEach(() => {
                act(() => {
                    hookState.updateArgs({
                        id: 'RECORDID',
                        overwriteOnLoad: false,
                    });
                });
            });

            test('displays loading state', () => {
                expect(hookState.loadState).toBe('loading');
                expect(hookState.loading).toBe(true);
                expect(hookState.isNewRecord).toBe(false);
                expect(hookState.hookArgs[0].onGet).toHaveBeenCalledTimes(1);
                expect(hookState.hookArgs[0].onGet.pending).toBe(true);
                expect(hookState.hookArgs[0].onGet).toHaveBeenCalledWith('RECORDID');
            });

            describe('when loading is successful', () => {
                beforeEach(
                    () => act(
                        () => hookState.hookArgs[0].onGet.resolve({ name: 'Old Greg' })
                    )
                );

                test('displays loaded state', () => {
                    expect(hookState.loadState).toBe('idle');
                    expect(hookState.state).toEqual({
                        name: 'Old Greg',
                        age: 0,
                    });
                    expect(hookState.initialValue).toEqual({
                        name: 'Old Greg',
                        age: 0,
                    });
                    expect(hookState.isDirty()).toBe(false);
                    expect(hookState.hookArgs[0].onGet.pending).toBe(false);
                });

                test('reloading record', () => {
                    act(() => {
                        hookState.reload();
                    });

                    expect(hookState.loadState).toBe('loading');
                    expect(hookState.loading).toBe(true);
                    expect(hookState.isNewRecord).toBe(false);
                    expect(hookState.hookArgs[0].onGet).toHaveBeenCalledTimes(2);
                    expect(hookState.hookArgs[0].onGet.pending).toBe(true);
                    expect(hookState.hookArgs[0].onGet).toHaveBeenCalledWith('RECORDID');
                });

                describe('when updating record', () => {
                    beforeEach(() => {
                        act(() => {
                            hookState.save();
                        });
                    });

                    test('displays updating state', () => {
                        expect(hookState.loadState).toBe('updating');
                        expect(hookState.updating).toBe(true);
                        expect(hookState.saving).toBe(true);
                        expect(hookState.hookArgs[0].onUpdate).toHaveBeenCalledTimes(1);
                        expect(hookState.hookArgs[0].onUpdate.pending).toBe(true);
                        expect(hookState.hookArgs[0].onUpdate).toHaveBeenCalledWith('RECORDID', {
                            name: 'Old Greg',
                            age: 0
                        });
                    });
                });
            });
        });
        describe('with overwriteOnLoad=true', () => {
            beforeEach(() => {
                act(() => {
                    hookState.updateArgs({
                        id: 'RECORDID',
                        overwriteOnLoad: true,
                    });
                });
            });

            describe('when loading is successful', () => {
                beforeEach(
                    () => act(
                        () => hookState.hookArgs[0].onGet.resolve({ name: 'Old Greg' })
                    )
                );

                test('displays loaded state', () => {
                    expect(hookState.loadState).toBe('idle');
                    expect(hookState.state).toEqual({
                        name: 'Old Greg',
                    });
                    expect(hookState.initialValue).toEqual({
                        name: 'Old Greg',
                    });
                    expect(hookState.isDirty()).toBe(false);
                    expect(hookState.hookArgs[0].onGet.pending).toBe(false);
                });
            });
        });
    });

    describe('when creating new record', () => {
        beforeEach(() => {
            act(() => {
                hookState.save();
            });
        });

        test('displays creating state', () => {
            expect(hookState.loadState).toBe('creating');
            expect(hookState.creating).toBe(true);
            expect(hookState.saving).toBe(true);
            expect(hookState.hookArgs[0].onCreate).toHaveBeenCalledTimes(1);
            expect(hookState.hookArgs[0].onCreate.pending).toBe(true);
            expect(hookState.hookArgs[0].onCreate).toHaveBeenCalledWith({
                name: '',
                age: 0
            });
        });
    })
})
