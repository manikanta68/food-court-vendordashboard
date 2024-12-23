import Header from "../Header"
import { LuShoppingBag } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { MdOutlineNotifications } from "react-icons/md";
import { parse, differenceInMinutes } from 'date-fns';


import "./index.css"
import { useEffect, useState } from "react";
import { Puff } from 'react-loader-spinner'
import OrderPopup from "../OrderPopup";


const apiResponseConstants = {
    initial: "INITIAL",
    inprogress: "INPROGRESS",
    success: "SUCCESS",
    failure: "FAILURE"
}

const Home = () => {

    const [apiResponse, setApiResponse] = useState({
        status: apiResponseConstants.initial,
        data: [],
        error: null
    })
    const [search,setSearch] = useState("")
    const [filter,setFilter] = useState("")
    const [applyFilters,setApplyFilters] = useState(false)
    const [popupOpen, setPopupOpen] = useState(false);
    const [order, setOrder] = useState(null);


    useEffect(() => {
        setApiResponse((prev) => ({
            ...prev,
            status: apiResponseConstants.inprogress
        }))
        const gettingData = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/?search=${search}&filter=${filter}`)
            
            const data = await response.json()
            if (response.ok === true) {
                console.log(data)
                setApiResponse({
                    status: apiResponseConstants.success,
                    data: data,
                    error: null
                })
            }
            else {
                setApiResponse((prev) => ({ prev, status: apiResponseConstants.failure }))
            }
        }

        gettingData()
        setApplyFilters(false)
    
    }, [applyFilters])


    const handleOpenPopup = (sampleOrder) => {
        setOrder(sampleOrder);
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
        setOrder(null);
    };

   
    const updateOrderStatus = async (action) => {
        const orderId = order.orderId
        const {data} = apiResponse
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, action }),
            });
             
            if (response.ok) {
                const resData = await response.json();
                console.log(resData.message);
                const options = {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  };
                
                const dateTime = new Date().toLocaleString('en-IN', options);
                const updateData = data.map((each) => {
                    if(each.orderId === orderId){
                         return {...each,status: action, completedtime: dateTime}
                    }
                    return each
                })
                console.log(updateData)
                setApiResponse({
                    status: apiResponseConstants.success,
                    data: updateData,
                    error: null
                }) 
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order.');
        }
    };
    
          

    const renderLoadingView = () => {
        return <div>
            <Puff
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    }

    const renderFailureView = () => {
        return <div className="failureViewContainer">
            <img
                src="https://res.cloudinary.com/djszohdjt/image/upload/v1706552284/alert-triangle_alvbje.png"
                alt="failure view"
                className="failure-image"
            />
            <p className="failure-text">Something went wrong. Please try again</p>
            <button className="retryButton" type="button">
                Try Again
            </button>
        </div>
    }


    const timeDifference = (completedTime) => {
        const parsedDate = parse(completedTime, 'dd/MM/yyyy, hh:mm:ss a', new Date(), {
            timeZone: 'Asia/Kolkata',
        });
        const now = new Date();
        const minutes = differenceInMinutes(now, parsedDate);
        if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (minutes < 1440) { 
            const hours = Math.floor(minutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(minutes / 1440);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }

    }

    const renderSuccessView = () => {
        const { data } = apiResponse
        const reversedOrders = data.reverse();


        const completedOrdersArray = data.filter((each) => each.status === "Completed")
        let completedOrdersCound = 0; 
        let incompletdOrders = 0;
        for(let each of data){
            if(each.status==="Completed"){
                completedOrdersCound += 1;
            }else if(each.status === "Inprogress"){
                incompletdOrders += 1;
            }
        }
        return <div className="home-success-container">
            <ul className="order-cards-ul-list">
                <li className="order-li-card">
                    <LuShoppingBag className="status-icons"  color="skyblue" />
                    <div>
                        <p>Total Orders</p>
                        <p className="order-count">{data.length}</p>
                    </div>
                </li>
                <li className="order-li-card">
                    <FaRegClock className="status-icons"  color="orange" />
                    <div>
                        <p>Perding Orders</p>
                        <p className="order-count">{incompletdOrders}</p>
                    </div>
                </li>
                <li className="order-li-card">
                    <GrStatusGood className="status-icons"  color="green" />
                    <div>
                        <p>Completed Orders</p>
                        <p className="order-count">{completedOrdersCound}</p>
                    </div>
                </li>
            </ul>
            <div className="recent-orders-container">
                <div className="orders-header-container">
                    <p className="recent-order-heading">Recent Orders</p>
                    <div className="filters-and-search-options-container">
                        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="status-options">
                            <option>All Orders</option>
                            <option>Inprogress</option>
                            <option>Complete</option>
                            <option>Cancel</option>
                        </select>
                        <div className="search-container">
                            <input value={search} onChange={(event) => setSearch(event.target.value)} className="status-search" placeholder="search orders" type="search" />
                            <button type="button" onClick={() => setApplyFilters(true)} className="search-button">
                                <CiSearch size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <table className="orders-table">
                        <thead>
                            <tr className="table-head">
                                <th>ORDERID</th>
                                <th>CUSTOMER</th>
                                <th>BOOKINGTIME</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reversedOrders.map((each) => <tr key={each.id}>
                                <td>{each.orderId}</td>
                                <td className="td-customarname">{each.name}</td>
                                <td>{each.datetime}</td>
                                <td><p className={`${each.status==="Inprogress"&& "status-pending"} ${each.status==="Completed" && "status-completed"} ${each.status==="Cancelled" && "status-cancelled"}`}>{each.status}</p></td>
                                <td>
                                    <button type="button" onClick={()=> handleOpenPopup(each)} 
                                    className="view-details-button">View Details</button>
                                </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
            {popupOpen && (
                <OrderPopup
                    orderDetails={order}
                    onAction={updateOrderStatus}
                    onClose={handleClosePopup}
                />
            )}
            <div className="notifications-container">
                <div className="notifications-head-container">
                    <h3 className="notificaion-heading">Notifications</h3>
                    <MdOutlineNotifications  className="notification-icon"/>
                </div>
                 <p className="new-orders-received">🔔 New orders received!</p>
                
               {completedOrdersArray.length > 0 && <ul className="order-complition-notification-ul"> {completedOrdersArray.map((each) => <li className="order-complition-notification-li" key={each.id}><p>Order <strong>{each.orderId.toUpperCase()}</strong> Completed</p> <p>{timeDifference(each.completedtime)}</p> </li>)} </ul> } 
                
            </div>
        </div>
    }

    const renderApiResponseData = () => {
        const { status } = apiResponse
        switch (status) {
            case (apiResponseConstants.failure):
                return renderFailureView()
            case (apiResponseConstants.success):
                return renderSuccessView()
            case (apiResponseConstants.inprogress):
                return renderLoadingView()
            default:
                return null
        }
    }


    return <div className="home-bg-container">
        <Header />
        <div className="home-container">
            {renderApiResponseData()}
        </div>
    </div>
}


export default Home