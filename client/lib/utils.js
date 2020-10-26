import React, { useState } from 'react';
import { isFunction } from 'lodash';
import produce from 'immer';

export const round = (value, decimals) =>
  `${Math.round(`${value}e${decimals}`)}e-${decimals}` |> Number;

export const useImmerState = initialState => {
  const [state, setState] = useState(initialState);

  const oldState = React.useRef();
  oldState.current = state;

  const setImmerState = React.useRef(fnOrObject => {
    if (isFunction(fnOrObject)) {
      const fn = fnOrObject;
      setState(produce(oldState.current, fn));
    } else {
      const newState = fnOrObject;
      setState({
        ...oldState.current,
        ...newState,
      });
    }
  });

  return [state, setImmerState.current];
};
