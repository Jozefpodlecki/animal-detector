import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from "./App";
import store from "store";
import "normalize.css";
import "./styles.scss";

const root = document.getElementById(process.env.root);

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </HashRouter>
    </Provider>,
    root
);
