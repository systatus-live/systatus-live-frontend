"use client"

import { ClassAttributes, InputHTMLAttributes, JSX } from 'react';

export default function InputTextArea(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLTextAreaElement> & InputHTMLAttributes<HTMLTextAreaElement>) {

  return (
    <textarea {...props} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6" />
  )
}