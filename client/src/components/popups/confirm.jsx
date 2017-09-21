import React from 'react';

export const ConfirmBlock = ({status, message, resolve, reject}) => {
    if (status) {
        return (
            <div className="alert alert-danger float-alert" role="alert">
                <h4 className="alert-heading">Confirm action</h4>
                <p>{message}</p>
                <hr/>
                <button type="button"
                        className="btn btn-danger"
                        onClick={() => resolve()}
                >OK</button>
                <button type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={() => reject()}
                >Cancel</button>
            </div>
        )
    } else {
        return null
    }
};
