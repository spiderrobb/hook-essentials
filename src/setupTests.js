// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, act } from "@testing-library/react";
import { useState } from "react";
// import { MemoryRouter } from 'react-router';

//
function setupTestComponent(Component, props) {
    const result = {};
    function Wrapper() {
        const [currentProps, setCurrentProps] = useState(props);
        result.setProps = setCurrentProps;
        return <Component {...currentProps} />;
    }
    render(
        // <MemoryRouter>
            <Wrapper />
        // </MemoryRouter>
    );
    return result;
}

function setupTestHook(hook, args = [], config) {
    const result = {
        renderCount: 0
    };
    function Wrapper() {
        const [currentArgs, setCurrentArgs] = useState(args);
        const currentHookState = hook(...currentArgs);
        Object.assign(result, currentHookState);
        result.setArgs = (...args) => setCurrentArgs(args);
        result.renderCount++;
        result.hookArgs = currentArgs;
        return null;
    }
    render(
        // <MemoryRouter initialEntries={initialEntries}>
            <Wrapper />
        // </MemoryRouter>
    );
    return result;
}
function asyncFn() {
    const fn = jest.fn(() => {
        const promise = new Promise((resolve, reject) => {
            fn.pending = true;
            fn.resolve = result => {
                fn.pending = false;
                resolve(result);
                return promise;
            };
            fn.reject = result => {
                fn.pending = false;
                reject(result);
                return promise;
            };
        });
        return promise;
    });
    fn.pending = false;
    return fn;

}
global.act = act;
global.setupTestHook = setupTestHook;
global.asyncFn = asyncFn;
