import { useCallback, useRef, useState } from 'react';

const DEFAULT_EMPTY_SELECTION = undefined;

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getDefaultSelection(multiple) {
    return multiple ? [] : DEFAULT_EMPTY_SELECTION;
}


function useSelection({ multiple = false, } = {}) {
    const [selection, setSelection] = useState(getDefaultSelection(multiple));
    const selectionRef = useRef();
    selectionRef.current = selection;

    const selectItem = useCallback(
        (...items) => setSelection(
            currentSelection => multiple
                ? [...currentSelection, ...items].filter(onlyUnique)
                : items[0]
        ),
        [multiple, setSelection]
    );

    const unSelectItem = useCallback(
        (...items) => setSelection(
            currentSelection => multiple
                ? currentSelection.filter(selectedItem => !items.includes(selectedItem))
                : currentSelection === items[0] ? DEFAULT_EMPTY_SELECTION : currentSelection
        ),
        [multiple, setSelection]
    );


    const clearSelection = useCallback(
        () => setSelection(getDefaultSelection(multiple)),
        [multiple, setSelection]
    );

    const isItemSelected = useCallback(
        item => multiple
            ? selectionRef.current.includes(item)
            : selectionRef.current === item,
        [multiple, selectionRef]
    );

    const toggleItem = useCallback(
        (...items) => {
            const selectItems = [];
            const unselectItems = [];
            items.forEach(item => {
                if (isItemSelected(item)) {
                    unselectItems.push(item);
                } else {
                    selectItems.push(item);
                }
            });
            selectItems.length && selectItem(...selectItems);
            unselectItems.length && unSelectItem(...unselectItems);
        },
        [isItemSelected, unSelectItem, selectItem]
    )

    return {
        selection,
        selectionRef,
        selectItem,
        unSelectItem,
        isItemSelected,
        toggleItem,
        clearSelection,
    };
}

export default useSelection;
