"use client"

import { JSX, ClassAttributes, InputHTMLAttributes } from "react"

export default function InputCheckBox(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
  )
}