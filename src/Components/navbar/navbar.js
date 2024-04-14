"use client"
import Sidebar from "@/Components/sidebar/sidebar";
import { useState } from "react";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import './sidebardiv.scss'
import './navbar.scss'
import { useSelector } from "react-redux";
const Navbar = () => {
    const [hide,setHide] = useState(true);
    const handlesidebar = ()=>{
      setHide(!hide)
  }
  const {user} = useSelector((state) => state.rootReducer.user);
  return (
    <header>
    <nav>
    <div>
    <span>Quizpl.com</span>
    <span>Hi, {!user || user.length===0 || user[0]==="Unable to verify. Try login in again!"?"User":user[0].displayName}</span>
    </div>
    <div onClick={()=>handlesidebar()} className='sidebarr'>
    <BsLayoutSidebarInsetReverse size={'3rem'} color='black' />
    </div>
    <Sidebar hide={hide} />
    </nav>
    </header>
  )
}

export default Navbar