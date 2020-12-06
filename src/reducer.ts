import * as actions from "./actions";
import { ActionType, getType } from "typesafe-actions";
import { combineReducers } from "redux";

export type Action = ActionType<typeof actions>;

const initialState = {
    link: "",
    title: "",
    isLoading: true,
    hasInteracted: false,
    canPlay: true,
    isPlaying: false,
};

const pageReducer = (
    state = initialState,
    action: Action
): typeof initialState => {
    switch (action.type) {
        case getType(actions.load):

        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    page: pageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;