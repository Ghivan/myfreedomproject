import React from 'react';

export const ErrorBlock = ({message, clearError}) => {
    if (message){
        setTimeout(() => clearError(), 2000);
        return (
            <div className="alert alert-danger text-center float-alert"
                 role="alert"
                 onClick={() => clearError()}
            >
                {message}
                <br />(click to hide)
            </div>
        )
    } else {
        return null
    }
};
