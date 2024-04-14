import React from 'react'
import './popup.scss'
const Popup = ({popup,setPop,setIndex,setScore,sendAnswer}) => {
  const handlePopup = ()=>{
    sendAnswer()
    setPop(!popup)
    setIndex(0);
    setScore(0);
  }
  return (
    <div className='popup'>
        <h2>Thanks for submitting the quiz!</h2>
        <button onClick={handlePopup}>Done</button> 
    </div>
  )
}

export default Popup