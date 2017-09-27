import React from 'react';
import './ErrorMessage.css';

export const ErrorBlock = ({message, clearError}) => {
    if (message){
        let messageShowTime = setTimeout(() => clearError(), 2000);
        return (

            <div className="messageWrapper"
                 onClick={() => {
                     clearInterval(messageShowTime);
                     clearError();
                 }}
            >
                <div className="alert alert-danger text-center messageBlock"
                     role="alert"
                >
                    {message}
                </div>
            </div>
        )
    } else {
        return null
    }
};
