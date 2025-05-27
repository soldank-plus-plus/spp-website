import React from 'react'
import ReactDOM from 'react-dom/client'
import Landing from '@/components/pages/Landing'
import './index.css'

function App() {
    return <Landing />
}

export default App

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
