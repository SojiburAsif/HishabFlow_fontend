import React from 'react'

export default function ShopOwnerLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="animate-pulse mb-8">
        <div className="h-12 bg-zinc-800 rounded-[1.5rem] w-64 mb-4" />
        <div className="h-4 bg-zinc-800 rounded w-96" />
      </div>

      {/* Shop info skeleton */}
      <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-black p-8 animate-pulse">
        <div className="h-12 bg-zinc-800 rounded w-48 mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-32" />
      </div>

      {/* Subscription skeleton */}
      <div className="mt-6 rounded-[2rem] border border-zinc-800 bg-black p-8 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-zinc-900 p-4 border border-zinc-800">
              <div className="h-3 bg-zinc-800 rounded w-16 mb-2" />
              <div className="h-6 bg-zinc-800 rounded w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick links skeleton */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-6">
            <div className="h-4 bg-zinc-800 rounded w-20 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-32" />
          </div>
        ))}
      </div>
    </>
  )
}
