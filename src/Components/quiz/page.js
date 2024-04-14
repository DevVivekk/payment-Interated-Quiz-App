"use client"
import { useEffect, useMemo, useState } from 'react'
import mydata from './quizdata.json'
import { useContextt } from '@/customHooks/useContext'
import './quiz.scss'
import { useDispatch, useSelector } from 'react-redux'
import { addAnswer, addUser } from '@/redux/userSlice'
import Popup from '@/assets/popup/popup'
const getLogin = async()=>{
  const res  = await fetch('http://localhost:5000/loggedin');
  const data  = await res.json()
  return data
}
const QuizPage = () => {
  const {user} = useSelector((state) => state.rootReducer.user);
  const {answered} = useSelector((state) => state.rootReducer.user);
  console.log("answered ",answered)
  const {socket} = useContextt();
  const data = useMemo(()=>mydata,[])
  const [index,setIndex] = useState(0);
  const [score,setScore] = useState(0);
  const [ans,setAns] = useState('');
  const [users,setUsers] = useState([]);
  const [answers,setAnswers]= useState([])
  const [pop,setPop] = useState(false);
  useEffect(()=>{
    socket?.on("user-came",(data)=>{
      setUsers(data)
    })
    socket?.on("user-went",(data)=>{
      setUsers(data)
    })
    return ()=>{ 
      socket?.off("user-came")
      socket?.off("user-went")
    }
  },[socket])
const dispatch = useDispatch();

//storing user credentials in redux
  useEffect(()=>{
    (async function(){
    if(user.length<=0){
    const ans = await getLogin();
    console.log(ans);
    dispatch(addUser(ans));
    }else{
      return
    }
    })();
  },[dispatch,user.length])

//save answers to the redux store
const handleDispatch = ()=>{
  dispatch(addAnswer({...data[index],answerd:ans}));
}

  //answer submission function
  const submitans = () => {
    if(index===data.length || !ans){
      alert("Please answer");
      return;
    }
    setScore((item)=>(item===-(data.length) || item===data.length)?item:ans===data[index].ans?item+1:item-1);
    setAns("");    
    setIndex(prev => prev < data.length - 1 ? prev + 1 : prev);
    setPop(prev => index < data.length - 1 ? false: true);
    setAnswers(prev => {
      const updatedAnswers = [...prev]; // Copy the previous answers array
      updatedAnswers[index] = { ...data[index], answered: ans }; // Update the answer object at the given index
      return updatedAnswers; // Return the updated answers array
    })
    index!==data.length?handleDispatch():null
}
const prevQuiz = ()=>{    
  setIndex(prev=>prev===0?prev:prev-1);
}

//send answers to the backend database
async function sendAnswer(){
  const res  = await fetch("http://localhost:5000/addanswers",{
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    },
    body:JSON.stringify({answers})
  })
  if(res.status===201){
    alert("Quiz added to the database!")
  }else{
    alert("Something went wrong!")
  }
}
  return (
    <main>
    <div style={pop?{"filter":"blur(10px)"}:{"filter":"blur(0px)"}} className='quizPage'>
    <section className='head-div'>
    <h4>My score: {score}</h4>
    <span>Users Online: {users.length}</span>
    </section>
    {
      <div className='quiz-box'>
      <h3>{index+1}) {data[index].ques}</h3>
      <section className='input-quiz'>
      <div>
      <label htmlFor={data[index].a}>{data[index].a}</label>
      <input  checked={ans===data[index].a} onChange={(e)=>setAns(e.target.value)} id={data[index].a} type="radio" value={data[index].a} name={data[index].ques}></input><br />
      </div>
      <div>
      <label htmlFor={data[index].b}>{data[index].b}</label>
      <input  checked={ans===data[index].b} onChange={(e)=>setAns(e.target.value)} id={data[index].b} type="radio" value={data[index].b} name={data[index].ques}></input><br />
      </div>
      <div>
      <label htmlFor={data[index].c}>{data[index].c}</label>
      <input  checked={ans===data[index].c} onChange={(e)=>setAns(e.target.value)} id={data[index].c} type="radio" value={data[index].c} name={data[index].ques}></input><br />
      </div>
      <div>
      <label htmlFor={data[index].d}>{data[index].d}</label>
      <input  checked={ans===data[index].d} onChange={(e)=>setAns(e.target.value)} id={data[index].d} type="radio" value={data[index].d} name={data[index].ques}></input><br />
      </div>
      </section>
      <section className='quiz-button'>
      <button onClick={submitans}>Submit ans</button>
      <button onClick={prevQuiz}>Previous question</button>
      </section>
      </div>
    }
    </div>
    {pop?
    <section className='popup-section'>
    <Popup popup={pop} setIndex={setIndex} setScore={setScore} setPop={setPop} sendAnswer={sendAnswer} />
    </section>
    :null}
    </main>
  )
}

export default QuizPage