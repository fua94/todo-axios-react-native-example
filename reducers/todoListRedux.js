// The types of actions that you can dispatch to modify the state of the store
export const types = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    FETCH_TODOS_REQUEST: 'FETCH_TODOS_REQUEST',
    FETCH_TODOS_RESPONSE: 'FETCH_TODOS_RESPONSE',
    CLEAR_TODOS: 'CLEAR_TODOS',
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
    fetchTodos: () => async (dispatch, getState) => {
        dispatch({
            type: types.FETCH_TODOS_REQUEST
        })

        try {
            const response = await fetch('http://192.168.0.100:3000/api/tasks')
            const todos = await response.json()

            dispatch({
                type: types.FETCH_TODOS_RESPONSE,
                payload: todos
            })
        } catch (e) {
            dispatch({
                type: types.FETCH_TODOS_RESPONSE,
                payload: e,
                error: true
            })
        }
    },
    add: (item) => {
        return {
            type: types.ADD,
            payload: item
        }
    },
    remove: (index) => {
        return {
            type: types.REMOVE,
            payload: index
        }
    }
}

// Initial state of the store
const initialState = {
    loading: true,
    error: false,
    todos: [{
        _id: 1,
        title: 'hey'
    }]
}

export const reducer = (state = initialState, action) => {
    const {
        todos
    } = state
    const {
        type,
        payload,
        error
    } = action

    switch (type) {
        case types.FETCH_TODOS_REQUEST:
            {
                return {
                    ...state,
                    loading: true,
                    error: false
                }
            }
        case types.FETCH_TODOS_RESPONSE:
            {
                if (error) {
                    return {
                        ...state,
                        loading: false,
                        error: true
                    }
                }

                return {
                    ...state,
                    loading: false,
                    todos: payload
                }
            }
        case types.ADD:
            {
                return {
                    ...state,
                    todos: [payload, ...todos],
                }
            }
        case types.REMOVE:
            {
                return {
                    ...state,
                    todos: todos.filter((todo, i) => i !== payload),
                }
            }
    }

    return state
}
