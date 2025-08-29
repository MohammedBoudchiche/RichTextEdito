import { useState } from 'react'
import './App.css'
import Editor from './components/Editor/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-screen h-screen bg-black p-4 flex flex-col justify-center items-center'>
         <Editor/>
    </div>
  )
}

export default App
