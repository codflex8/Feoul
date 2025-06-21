import clsx from 'clsx'
import React from 'react'
import { MdEventAvailable } from "react-icons/md";
import { RiReservedFill } from "react-icons/ri";
import { FaMoneyBill1Wave } from "react-icons/fa6";

export const StatusIcon = {
  متاح: MdEventAvailable,
  محجوز: RiReservedFill,
  مباع: FaMoneyBill1Wave,
};

declare type Status = "متاح" | "محجوز" | "مباع";

const StatusBadge = ({ status }: { status: Status }) => {
  const Icon = StatusIcon[status]
  return (
    <div className={clsx('flex w-fit items-center gap-2 rounded-full px-4 py-1', {
      'bg-[#4ad992d8]': status === 'متاح',
      'bg-[#fec43ddc]': status === 'محجوز',
      'bg-[#ff8f66dc]': status === 'مباع',
    })}>
      <Icon color='#fff' className='!w-4 !h-4' />
      <p className={clsx('text-sm font-semibold capitalize text-white', {
      })}>
        {status}
      </p>
    </div>
  )
}

export default StatusBadge