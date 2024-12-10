import React from 'react';
import { Room } from '../../types';

interface RoomTableProps {
  rooms: Room[];
}

export function RoomTable({ rooms }: RoomTableProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="pb-2">Number</th>
            <th className="pb-2">Description</th>
            <th className="pb-2 text-right">Size (m²)</th>
            <th className="pb-2">Floor Material</th>
            <th className="pb-2 text-right">Height (m)</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-t border-gray-200">
              <td className="py-2 text-gray-600">{room.number}</td>
              <td className="py-2 text-gray-800">{room.description}</td>
              <td className="py-2 text-right text-gray-600">
                {room.size.toFixed(2)}
              </td>
              <td className="py-2 text-gray-600">{room.floorMaterial}</td>
              <td className="py-2 text-right text-gray-600">
                {room.ceilingHeight.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}