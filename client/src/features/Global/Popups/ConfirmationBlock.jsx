import React from 'react';
import './ConfirmationBlock.css';

export const ConfirmationBlock = ({status, message, resolve, reject}) => {
    if (status) {
        return (
            <div className="popupWrapper">
                <div className="alert alert-danger popup" role="alert">
                    <h4 className="alert-heading">Confirm action</h4>
                    <p>{message}</p>
                    <div>
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
                </div>
            </div>
        )
    } else {
        return null
    }
};
