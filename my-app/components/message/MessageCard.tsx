import Image from 'next/image';

interface MessageCardProps {
  title: string;
  text: string;
  pic: string;
}

const MessageCard = ({ title, text, pic }: MessageCardProps) => {
  return (
    <div className="flex flex-row h-[5rem] items-center border-y border-slate-600">
      <Image 
        src={pic} 
        alt={text} 
        width={10} 
        height={10} 
        className="rounded-full object-cover w-[4rem] h-[4rem]" 
      />
      <div className="flex flex-col ml-4 justify-start">
        <h1 className="text-slate-800 font-semibold text-[20px] mb-1">{title}</h1>
        <h3 className="text-slate-400 font-semibold text-[14px]">{text}</h3>
      </div>
    </div>
  );
};

export default MessageCard;
