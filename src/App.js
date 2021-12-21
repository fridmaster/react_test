import logo from './logo.svg';
import './App.css';

import { useEffect, useReducer, useRef, useState } from 'react'; 





function App() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([])
  const [loading, setLoading] = useState(false);
  const beRoute = 'http://localhost:3001';
  function addTask(task){
    setLoading(true)
    fetch(`${beRoute}/addTask`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({task:task})
    }).then(()=>{
      setLoading(false)
      setTaskList([...taskList, task]);
      setTask('');
    })
  }

  useEffect(()=>{
    setLoading(true)
    return fetch(`${beRoute}/getTasks`)  .then(response => response.json())
    .then(data => {      
      setLoading(false);
      setTaskList(data.tasks)
    });
  }, [])

    function showLoading(){
      if(loading){
        return <span>LOADING</span>
      } else{
        return <div> The  new tasks {task}</div>
      }
    }
  
  return (
    <div className="App">
    <label className="relative block">
      <span className="sr-only">Search</span>
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg className="h-5 w-5 fill-gray-300" viewBox="0 0 20 20"></svg>
      </span>
      <input value={task} onChange={(e)=>{setTask(e.target.value)}} className="placeholder:italic placeholder:text-gray-400 block bg-white w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search for anything..." type="text" name="search"/>
    </label>
      <button onClick={e=>{addTask(task)}}>Add</button>
      {showLoading()}
      <ul className="list-disc">
        {taskList.map((task,id)=>{
            return <li id ={id}>{task}</li>
        })}
      </ul>
    </div>
  );
}

export default App;
