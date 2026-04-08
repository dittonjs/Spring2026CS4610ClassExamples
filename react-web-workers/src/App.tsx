import { useEffect } from 'react'
import './App.css'
import MyWorker from './worker?worker';

function App() {
  useEffect(() => {
    const worker = new MyWorker()
    worker.onmessage = (event) => {
      console.log('Message from worker:', event.data)
    }
  }, [])

  return (
    <>
      <h1>Hello, world!</h1>
    </>
  )
}

export default App
