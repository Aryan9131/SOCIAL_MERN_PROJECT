import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Provider} from 'react-redux'
import store from './app/store'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(  
  <Provider store={store}>
    <Router>
       <App />
     </Router>
  </Provider >,
)
