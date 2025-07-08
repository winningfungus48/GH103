import styles from './App.module.css';
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.app}></div>
  )
}

export default App
