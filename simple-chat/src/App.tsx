import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const SOCKET_URL = 'https://usu-4610-socket-server-35ce51c3c6d2.herokuapp.com/'

interface ChatMessage {
  id: string
  text: string
  isOwn: boolean
  timestamp: number
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('chat message', (payload: { text: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          text: payload?.text ?? String(payload),
          isOwn: false,
          timestamp: Date.now(),
        },
      ])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('chat message')
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || !socketRef.current) return

    const msg: ChatMessage = {
      id: `${Date.now()}-own`,
      text,
      isOwn: true,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, msg])
    setInput('')
    socketRef.current.emit('chat message', { text })
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1>Simple Chat</h1>
        <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </header>

      <ul className="message-list">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`message ${msg.isOwn ? 'message-own' : 'message-other'}`}
          >
            <span className="message-text">{msg.text}</span>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <form className="input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
          autoComplete="off"
        />
        <button type="submit" disabled={!connected || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App
