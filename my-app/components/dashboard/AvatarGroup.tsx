// AvatarGroup.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const AvatarGroup: React.FC = () => {
  const avatars = [
    { id: 1, src: 'https://source.unsplash.com/random/200x200?sig=1', fallback: 'A' },
    { id: 2, src: 'https://source.unsplash.com/random/200x200?sig=2', fallback: 'B' },
    { id: 3, src: 'https://source.unsplash.com/random/200x200?sig=3', fallback: 'C' },
    { id: 4, src: 'https://source.unsplash.com/random/200x200?sig=4', fallback: 'D' },
  ];

  return (
    <div className="flex -space-x-3">
      {avatars.map((avatar) => (
        <Avatar key={avatar.id} className="w-8 h-8 border-2 border-black rounded-full">
          <AvatarImage src={avatar.src} />
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export default AvatarGroup;
