import React, { Suspense } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4 text-slate-400">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">Loading chapter...</p>
    </div>
  </div>
)

const Ch01 = React.lazy(() => import('./chapters/ch01-big-picture'))
const Ch02 = React.lazy(() => import('./chapters/ch02-tokenization'))
const Ch03 = React.lazy(() => import('./chapters/ch03-attention'))
const Ch04 = React.lazy(() => import('./chapters/ch04-transformer'))
const Ch05 = React.lazy(() => import('./chapters/ch05-pretraining'))
const Ch06 = React.lazy(() => import('./chapters/ch06-finetuning'))
const Ch07 = React.lazy(() => import('./chapters/ch07-alignment'))
const Ch08 = React.lazy(() => import('./chapters/ch08-reasoning'))
const Ch09 = React.lazy(() => import('./chapters/ch09-deployment'))

const CHAPTER_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<Record<string, never>>>> = {
  '1': Ch01,
  '2': Ch02,
  '3': Ch03,
  '4': Ch04,
  '5': Ch05,
  '6': Ch06,
  '7': Ch07,
  '8': Ch08,
  '9': Ch09,
}

function ChapterRoute({ chapterId }: { chapterId: string }) {
  const Component = CHAPTER_COMPONENTS[chapterId]
  if (!Component) return <Navigate to="/" replace />
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'chapter/1', element: <ChapterRoute chapterId="1" /> },
      { path: 'chapter/2', element: <ChapterRoute chapterId="2" /> },
      { path: 'chapter/3', element: <ChapterRoute chapterId="3" /> },
      { path: 'chapter/4', element: <ChapterRoute chapterId="4" /> },
      { path: 'chapter/5', element: <ChapterRoute chapterId="5" /> },
      { path: 'chapter/6', element: <ChapterRoute chapterId="6" /> },
      { path: 'chapter/7', element: <ChapterRoute chapterId="7" /> },
      { path: 'chapter/8', element: <ChapterRoute chapterId="8" /> },
      { path: 'chapter/9', element: <ChapterRoute chapterId="9" /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
