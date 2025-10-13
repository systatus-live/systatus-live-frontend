import { type ReactElement } from 'react';

export default function Modal(props: { children?: ReactElement | ReactElement[] | undefined; } & { title?: string; }) {
  return (
    <div className="fixed inset-0 z-1 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[30rem]">
        <div className="flex justify-between items-center mb-4">
          {props.title ? <h2 className="text-lg font-semibold">{props.title}</h2> : <div></div>}
        </div>
        {props.children}
      </div>
    </div>
  )
}