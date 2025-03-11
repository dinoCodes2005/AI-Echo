import React from 'react'

export default function Search() {
  return (
    <div className='px-3 pt-5'>
        <div className="w-full ">
    <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-blue-900 focus:bg-gray-900 overflow-hidden">
      <div className="grid place-items-center h-full w-12 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        className="peer h-full w-full outline-none text-sm text-blue-100 placeholder-blue-100 px-2 pr-2 bg-blue-900 focus:bg-gray-900"
        type="text"
        id="search"
        placeholder="Search something.."
      />
    </div>
  </div>
    </div>
  )
}
