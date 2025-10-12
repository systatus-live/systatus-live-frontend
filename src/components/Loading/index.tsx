import { BarLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="fixed inset-0 ">
      <BarLoader style={{ width: "100%" }} color="#113455" />
    </div>
  )
}