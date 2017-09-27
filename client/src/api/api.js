const checkOk = response => {
    if (response.ok) {
        if (response.status === 200 || response.status === 201) {

            return response.json();
        }
        throw new Error(response.json());
    } else {
        if (response.status === 400) {
            return response.json()
        }

        if (response.status === 404){
            return '404'
        }
    }
};

const makeRequestWithBody = (url, method, bodyObject) => {
    const body = JSON.stringify(bodyObject);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(url, {method, body, headers})
        .then(checkOk)
        .catch((err) => console.warn(err));
};

export const APIDriver = {
    getAll: (entityType) => fetch(`/${entityType}`).then(checkOk),
    getById: (entityType, id) => fetch(`/${entityType}/${id}`).then(checkOk),
    remove:(entityType, id) =>
        fetch(`/${entityType}/${id}`, {method: 'DELETE'}).then(checkOk),
    update: (entityType, id, object) =>
        makeRequestWithBody(`/${entityType}/${id}`, 'PUT', object),
    add: (entityType, object) => makeRequestWithBody(`/${entityType}`, 'POST', object)
};
