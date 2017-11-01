import React from 'react';
import './ErrorMessage.css';

const HIDE_MESSAGE_TIME = 2000;

export class ErrorBlock extends React.Component {
    componentWillReceiveProps(nextProps){
        if (nextProps.message){
            setTimeout(() => {
                if(this.props.message){
                    this.props.clearError();
                }
            }, HIDE_MESSAGE_TIME);
        }
    }
    render({message, clearError} = this.props) {
        if (message) {
            return (

                <div className="messageWrapper"
                     onClick={() => {
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
    }
};
