import { useCallback, useMemo, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { mergeSet, mergeUpdate } from './useStateObject';

function objectToSearchString(obj) {
    const urlParams = new URLSearchParams();
    Object.keys(obj).forEach(key => urlParams.append(key, obj[key]));
    return '?' + urlParams.toString();
}

function searchStringToObject(search) {
    const urlParams = new URLSearchParams(search);
    const paramState = {};
    for (const [key, value] of urlParams.entries()) {
        paramState[key] = value;
    }
    return paramState;
}

function useGetParams() {
    const history = useHistory();
    const location = useLocation();
    const searchString = location.search;

    const paramRef = useRef();
    paramRef.current = useMemo(
        () => searchStringToObject(searchString),
        [searchString]
    );

    const setPushParams = useCallback(update => history.push(objectToSearchString(mergeSet(paramRef.current, update))), [history, paramRef]);
    const updatePushParams = useCallback(update => history.push(objectToSearchString(mergeUpdate(paramRef.current, update))), [history, paramRef]);
    const setReplaceParams = useCallback(update => history.replace(objectToSearchString(mergeSet(paramRef.current, update))), [history, paramRef]);
    const updateReplaceParams = useCallback(update => history.replace(objectToSearchString(mergeUpdate(paramRef.current, update))), [history, paramRef]);


    return {
        history,
        location,
        paramRef,
        params: paramRef.current,
        searchString,
        setPushParams,
        updatePushParams,
        setReplaceParams,
        updateReplaceParams,
    };
}

export default useGetParams;
