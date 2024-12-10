import React from 'react';
import { Room } from '../../types';
import { RoomTable } from './RoomTable';

interface RoomListProps {
  rooms: Room[];
}

export function RoomList({ rooms }: RoomListProps) {
  const roomsByCategory = rooms.reduce((acc, room) => {
    if (!acc[room.category]) {
      acc[room.category] = [];
    }
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  return (
    <div className="space-y-6">
      {Object.entries(roomsByCategory).map(([category, rooms]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {category}
          </h3>
          <RoomTable rooms={rooms} />
        </div>
      ))}
    </div>
  );
}