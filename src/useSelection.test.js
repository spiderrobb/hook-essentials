import { setupTestHook, act } from "./testUtils";
import useSelection from "./useSelection";

describe('useSelection Hook', () => {
    let hookState;
    const ITEM = 'TEST-ITEM';
    const ITEM2 = 'TEST-ITEM-2';

    beforeEach(() => {
        hookState = setupTestHook(useSelection);
    });
    test('Initial State', () => {
        expect(hookState.selection).toBe(undefined);
        expect(hookState.selectionRef.current).toBe(undefined);
        expect(hookState.selectItem).toBeTruthy();
        expect(hookState.unSelectItem).toBeTruthy();
        expect(hookState.isItemSelected).toBeTruthy();
        expect(hookState.toggleItem).toBeTruthy();
        expect(hookState.clearSelection).toBeTruthy();
        expect(hookState.isItemSelected(ITEM)).toBe(false);
    });

    describe('When multiple=false', () => {
        beforeEach(() => {
            act(() => {
                hookState.selectItem(ITEM);
            });
        });

        test('Selecting Item', () => {
            expect(hookState.selection).toBe(ITEM);
            expect(hookState.selectionRef.current).toBe(ITEM);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });

        test('Unselecting Item', () => {
            act(() => {
                hookState.unSelectItem(ITEM);
            });

            expect(hookState.selection).toBe(undefined);
            expect(hookState.selectionRef.current).toBe(undefined);
            expect(hookState.isItemSelected(ITEM)).toBe(false);
        });

        test('Unselecting non selected Item', () => {
            act(() => {
                hookState.unSelectItem(ITEM2);
            });

            expect(hookState.selection).toBe(ITEM);
            expect(hookState.selectionRef.current).toBe(ITEM);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });

        test('Clearing Selection', () => {
            act(() => {
                hookState.clearSelection();
            });

            expect(hookState.selection).toBe(undefined);
            expect(hookState.selectionRef.current).toBe(undefined);
            expect(hookState.isItemSelected(ITEM)).toBe(false);
        });

        test('Toggling', () => {
            act(() => {
                hookState.toggleItem(ITEM);
            });

            expect(hookState.selection).toBe(undefined);
            expect(hookState.selectionRef.current).toBe(undefined);
            expect(hookState.isItemSelected(ITEM)).toBe(false);

            act(() => {
                hookState.toggleItem(ITEM);
            });

            expect(hookState.selection).toBe(ITEM);
            expect(hookState.selectionRef.current).toBe(ITEM);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });
    });

    describe('When multiple=true', () => {
        beforeEach(() => {
            act(() => {
                hookState = setupTestHook(useSelection, [{ multiple: true }]);
                hookState.selectItem(ITEM);
            });
        });

        test('Selecting Item', () => {
            expect(hookState.selection).toEqual([ITEM]);
            expect(hookState.selectionRef.current).toEqual([ITEM]);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });

        test('Unselecting Item', () => {
            act(() => {
                hookState.unSelectItem(ITEM);
            });

            expect(hookState.selection).toEqual([]);
            expect(hookState.selectionRef.current).toEqual([]);
            expect(hookState.isItemSelected(ITEM)).toBe(false);
        });

        test('Unselecting non selected Item', () => {
            act(() => {
                hookState.unSelectItem(ITEM2);
            });

            expect(hookState.selection).toEqual([ITEM]);
            expect(hookState.selectionRef.current).toEqual([ITEM]);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });

        test('Clearing Selection', () => {
            act(() => {
                hookState.clearSelection();
            });

            expect(hookState.selection).toEqual([]);
            expect(hookState.selectionRef.current).toEqual([]);
            expect(hookState.isItemSelected(ITEM)).toBe(false);
        });

        test('Toggling', () => {
            act(() => {
                hookState.toggleItem(ITEM);
            });

            expect(hookState.selection).toEqual([]);
            expect(hookState.selectionRef.current).toEqual([]);
            expect(hookState.isItemSelected(ITEM)).toBe(false);

            act(() => {
                hookState.toggleItem(ITEM);
            });

            expect(hookState.selection).toEqual([ITEM]);
            expect(hookState.selectionRef.current).toEqual([ITEM]);
            expect(hookState.isItemSelected(ITEM)).toBe(true);
        });
    });
});
