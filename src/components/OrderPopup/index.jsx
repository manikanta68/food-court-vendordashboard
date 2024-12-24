import React from 'react';
import './index.css';

const OrderPopup = ({ orderDetails, onAction, onClose }) => {
    if (!orderDetails) return null;

    const handleAction = (action) => {
        onAction(action); 
        onClose();
    };
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <h2>Order Details</h2>
                <div className="order-info">
                    <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                    <p><strong>Customer Name:</strong> {orderDetails.name}</p>
                    <p><strong>Email:</strong> {orderDetails.email.slice(0, 5) + "*".repeat(orderDetails.email.length - 5)}</p>
                    <p><strong>Order Items:</strong></p>
                    <ul className='ordered-items-ul'>
                        {orderDetails.orderDetails.map(each => <li key={each.id} className='ordered-listitem-li'><div><p>{each.name} * <strong>{each.quantity}</strong></p> <p className='instructions'> * {each.instructions}</p></div> <p>{each.price*each.quantity}</p></li>)}
                    </ul>
                    <p><strong>Status:</strong> {orderDetails.status}</p>
                    <p><strong>Order At:</strong> {orderDetails.datetime}</p>
                </div>
                <div className="actions">
                    <button className="action-btn completed" onClick={() => handleAction('Completed')}>
                        Mark as Completed
                    </button>
                    <button className="action-btn cancelled" onClick={() => handleAction('Cancelled')}>
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPopup;
