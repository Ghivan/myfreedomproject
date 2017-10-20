export const parseQueryString = (queryString) => {
    return queryString.split('&').reduce(
        (prev, curr) => {
            let currentPare = curr.split('=');
            if (currentPare.length === 2){
                prev[currentPare[0]] = currentPare[1];
            }
            return prev
        }, {}
    );
};

export const  bindActionCreators = (dispatch, actionCreators) => {
    const bound = {};

    Object.keys(actionCreators).forEach(key => {
        bound[key] = function () {
            dispatch(actionCreators[key].apply(null, arguments))
        }
    });

    return bound;
};