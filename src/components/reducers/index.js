const rootReducers = (state = 0, action) => {
  switch (action.type) {
    case "quantityCart":
      return {
        quantityCart: (state = action.payload),
      };
    default:
      return state;
  }
};

export default rootReducers;
