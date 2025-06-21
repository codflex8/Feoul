import Image from 'next/image';
import {useTranslations} from 'next-intl';
import clsx from 'clsx';

interface MapControlBtnProps { 
  icon?: string; 
  title: string, 
  text?: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const MapControlBtn = ({ icon, title, text, onClick }: MapControlBtnProps) => {
const t = useTranslations('MapPage');

  return (
    <div className="relative group mt-4">
      <button onClick={onClick} className="flex items-center justify-center rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-all cursor-pointer w-[34px] h-[34px] text-xs font-semibold">
        {icon && <Image className="w-5 h-5" src={`/assets/icons/${icon}.svg`} alt={icon} width={20} height={15} />}
        {text}
      </button>
      <div className={clsx("absolute top-1/2 -translate-y-1/2 bg-gray-700 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap", t("language").toLocaleLowerCase() === 'ar' ? "right-[0%]  group-hover:-translate-x-10" : "left-[-150%]  group-hover:translate-x-24")}>
        {title}
      </div>
    </div>
  )
}

export default MapControlBtn

