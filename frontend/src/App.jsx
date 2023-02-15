import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Chats from './Components/Chats'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={< Home />} />
        <Route path='/chats' element={<Chats />}/>  
      </Routes>
    </div>
  )
}

export default App
