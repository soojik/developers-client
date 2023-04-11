import { useState } from 'react';

import CreateRoomModal from './CreateRoomModal';
import SearchBar from './SearchBar';
import RoomList from './RoomList';
import React from 'react';

const LiveList: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const rooms = [
        { id: 1, title: 'Video 1', description: '...', mentorName: 'Mentor 1', thumbnailUrl: 'https://picsum.photos/id/237/200/300' },
        { id: 2, title: 'Video 2', description: '...', mentorName: 'Mentor 2', thumbnailUrl: 'https://picsum.photos/id/238/200/300' },
        { id: 3, title: 'Video 3', description: '...', mentorName: 'Mentor 3', thumbnailUrl: 'https://picsum.photos/id/239/200/300' },
        { id: 4, title: 'Video 4', description: '...', mentorName: 'Mentor 4', thumbnailUrl: 'https://picsum.photos/id/240/200/300' },
        { id: 5, title: 'Video 5', description: '...', mentorName: 'Mentor 5', thumbnailUrl: 'https://picsum.photos/id/241/200/300' },
        { id: 6, title: 'Video 6', description: '...', mentorName: 'Mentor 6', thumbnailUrl: 'https://picsum.photos/id/242/200/300' },
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleSearch = (query: string) => {
        console.log(`Searching for "${query}"...`);
        // Perform search using query parameter
    };


    //     <button
    //     className="py-2 px-4 bg-transparent text-red-600 font-semibold border border-red-600 rounded hover:bg-red-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
    //     onClick={handleOpenModal}>
    //     방 생성
    // </button>

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="w-full px-4 mt-4 lg:w-1/2">
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="w-32 px-4 mt-4">
                <button
                    className="py-2 px-4 bg-transparent text-red-600 font-semibold border border-red-600 rounded hover:bg-red-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0 w-32 flex justify-center"
                    onClick={handleOpenModal}
                >
                    방 생성
                </button>
            </div>
            <div className="w-full px-4 mt-4">
                <RoomList rooms={rooms}></RoomList>
            </div>
            {isModalOpen && <CreateRoomModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default LiveList;
