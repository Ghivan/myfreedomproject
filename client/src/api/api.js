const checkOk = response => {
    if (response.ok) {
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        throw new Error(response.statusText);
    } else {
        if (response.status === 400) {
            throw new Error(response.statusText);
        }

        if (response.status === 404){
            throw new Error(response.status);
        }
    }
};

const makeRequestWithBody = (url, method, bodyObject) => {
    const body = JSON.stringify(bodyObject);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(url, {method, body, headers})
        .then(checkOk)
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
