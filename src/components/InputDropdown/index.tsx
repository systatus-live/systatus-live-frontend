"use client"

import InputDropdownOption from '@/types/InputDropdownOption';
import { ClassAttributes, JSX, SelectHTMLAttributes } from 'react';

export default function InputDropdown(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLSelectElement> & SelectHTMLAttributes<HTMLSelectElement> & { options: InputDropdownOption[] }) {
  return (
    <select {...props} className="block w-full rounded-md bg-white px-3 py-2.25 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
      {[{ value: "", label: "" }, ...props.options].map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}