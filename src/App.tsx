// App.tsx is intentionally minimal — routing is handled by router.tsx
// This file exists for testing purposes (render smoke test)
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

const App: React.FC = () => <RouterProvider router={router} />

export default App
