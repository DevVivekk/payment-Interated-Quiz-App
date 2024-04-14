import React, { memo } from 'react'
import './sidebar.scss'
import { PurchasePage } from '@/assets/purchase/page'
import { useSelector } from 'react-redux'
const Sidebar = ({hide}) => {
  const openLogin = ()=>{
    window.open('http://localhost:5000/auth/google/callback')
  }
  const openLogout = ()=>{
    window.open('http://localhost:5000/loggedout', '_self');
  }
  const {handleClickk} = PurchasePage()
  const {user} = useSelector((state) => state.rootReducer.user);
  return (
    <div className={`main-sidebar ${hide ? 'hide-sidebar' : 'show-sidebar'}`} id='sidebar'>
    <ul>
        <li className={`${hide ? 'li-hide-sidebar' : 'li-show-sidebar'}`}>Home</li>
        <li className={`${hide ? 'li-hide-sidebar' : 'li-show-sidebar'}`}>My History</li>
        {(!user || user[0]==="Unable to verify. Try login in again!") ? (
  <li onClick={openLogin} className={`${hide ? 'li-hide-sidebar' : 'li-show-sidebar'}`}>Login</li>
) : (
  <li onClick={openLogout} className={`${hide ? 'li-hide-sidebar' : 'li-show-sidebar'}`}>Logout</li>
)}
        <li onClick={handleClickk} className={`${hide ? 'li-hide-sidebar' : 'li-show-sidebar'}`}>Make Payment</li>
    </ul>
    </div>
  )
}

export default memo(Sidebar)