"use client"

import InputDropdownOption from '@/enums/InputDropdownOption';
import { ClassAttributes, JSX, SelectHTMLAttributes, useEffect } from 'react';

export default function InputDropdown(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLSelectElement> & SelectHTMLAttributes<HTMLSelectElement> & { options: InputDropdownOption[] }) {
  return (
    <select {...props} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
      {[{ key: "", value: "" }, ...props.options].map((option) => (
        <option key={option.key} value={option.value}>{option.value}</option>
      ))}
    </select>
  )
}