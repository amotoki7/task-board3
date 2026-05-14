import { useState, useEffect } from 'react'
import './App.css'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadTasks() {
  try {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    const text = inputValue.trim()
    if (!text) return
    setTasks(prev => [...prev, { id: generateId(), text, completed: false }])
    setInputValue('')
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="container">
      <h1 className="title">タスクボード</h1>

      <div className="input-row">
        <input
          className="task-input"
          type="text"
          placeholder="新しいタスクを入力..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-button" onClick={addTask}>追加</button>
      </div>

      <p className="task-count">
        {tasks.filter(t => !t.completed).length} 件未完了 / 全 {tasks.length} 件
      </p>

      <ul className="task-list">
        {tasks.length === 0 && (
          <li className="empty">タスクがありません。追加してみましょう！</li>
        )}
        {tasks.map(task => (
          <li key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-text">{task.text}</span>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
              aria-label="削除"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
