import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreationProvider from './components/context/CreationContext'
import QuizProvider from './components/context/QuizContext'
import Loader from './components/Loader'
import RootLayout from './Layouts/RootLayout'
import './main.css'
const MainCreate = lazy(() => import('./components/MainCreate'))
const Main = lazy(() => import('./components/Main'))
const QuizList = lazy(() => import('./components/QuizList'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Loader />}>
            <QuizList />
          </Suspense>
        ),
      },
      {
        path: '/create',
        element: (
          <Suspense fallback={<Loader />}>
            <CreationProvider>
              <MainCreate />
            </CreationProvider>
          </Suspense>
        ),
      },
      {
        path: '/quiz/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <QuizProvider>
              <Main />
            </QuizProvider>
          </Suspense>
        ),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

