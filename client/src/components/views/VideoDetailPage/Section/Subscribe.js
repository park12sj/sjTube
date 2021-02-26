import axios from 'axios'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const [SubscriberNumber, setSubscriberNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    let variable={userTo:props.userTo}

    useEffect(() => {
        axios.post('/api/subscribe/subscriberNumber', variable)
        .then(response=>{
            if(response.data.success){
                setSubscriberNumber(response.data.subscriberNumber)
            }else{
                alert('fail')
            }
        })
    }, [])

    let subscribedVariable={userTo:props.userTo,userFrom:localStorage.getItem('userId')}

    axios.post('/api/subscribe/subscribed',subscribedVariable)
    .then(response=>{
        if(response.data.success){
            setSubscribed(response.data.subscribed)
        }else{
            alert('fail')
        }
    })

    const onSubscribe = ()=>{

        let subscribedVariable={
            userTo:props.userTo,
            userFrom:props.userFrom
        }

        if(Subscribed){//이미 구독중
            axios.post('/api/subscribe/unsubscribe',subscribedVariable)
            .then(response =>{
                if(response){
                    setSubscriberNumber(SubscriberNumber-1)
                    if (SubscriberNumber-1===0){
                        setSubscribed(!Subscribed)
                    }
                }else{
                    alert('fail cancle subscribe')
                }
            })
        }else{//아직 구독X
            axios.post('/api/subscribe/subscribe',subscribedVariable)
            .then(response =>{
                if(response){
                    setSubscriberNumber(SubscriberNumber+1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('fail subscribe')
                }
            })
        }
    }

    return (
        <div>
            <button 
            style={{backgroundColor: `${Subscribed ? 'grey':'red'}`, borderRadius:'4px', color:'white', 
            padding:'10px 16px', fontWeight:'500', fontSize:'1rem', testTransform:'uppercase'
            }}
            onClick={onSubscribe}
            >
            {SubscriberNumber} {Subscribed ? 'Subscribed':'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe