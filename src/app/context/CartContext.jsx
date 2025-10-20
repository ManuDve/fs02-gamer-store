import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialState = {
    items: [], // { id, name, price, img, quantity }
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const item = action.payload;
            const existing = state.items.find(i => i.id === item.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
                };
            }
            return { ...state, items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        }
        case 'REMOVE_ITEM': {
            const id = action.payload;
            return { ...state, items: state.items.filter(i => i.id !== id) };
        }
        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            return { ...state, items: state.items.map(i => i.id === id ? { ...i, quantity } : i) };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
        try {
            const stored = localStorage.getItem('cart_state');
            return stored ? JSON.parse(stored) : init;
        } catch (e) {
            return init;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cart_state', JSON.stringify(state));
        } catch (e) {
            // ignore
        }
    }, [state]);

    return (
        <CartStateContext.Provider value={state}>
            <CartDispatchContext.Provider value={dispatch}>
                {children}
            </CartDispatchContext.Provider>
        </CartStateContext.Provider>
    );
}

export function useCartState() {
    const context = useContext(CartStateContext);
    if (context === undefined) {
        throw new Error('useCartState must be used within a CartProvider');
    }
    return context;
}

export function useCartDispatch() {
    const context = useContext(CartDispatchContext);
    if (context === undefined) {
        throw new Error('useCartDispatch must be used within a CartProvider');
    }
    return context;
}

// Helpers
export function addToCart(dispatch, product, quantity = 1) {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
}

export function removeFromCart(dispatch, id) {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
}

export function updateQuantity(dispatch, id, quantity) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
}

export function clearCart(dispatch) {
    dispatch({ type: 'CLEAR_CART' });
}

export default CartProvider;
