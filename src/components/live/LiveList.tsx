import { useEffect, useState } from 'react';
import CreateRoomModal from './CreateRoomModal';
import SearchBar from './SearchBar';
import RoomList, { Room } from './RoomList';
import React from 'react';
import {EventProp} from "../../pages/Mentoring"
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";

interface LiveListProps {
    events: EventProp[];  // 내 기준으로 조회된 모든 스케쥴
}

const LiveList: React.FC<LiveListProps> = ({ events }) => {
    const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState); 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomList, setRoomList] = useState<Room[]>([]);

    const [currentPage, setCurrentPage] = useState(0); // 페이징
    const [displayedRooms, setDisplayedRooms] = useState<Room[]>([]);
    const PAGE_SIZE = 20;

    const fetchRooms = async (lastTime: Date | null) => {
        const lastDateTimeParam = lastTime ? `/next?lastDateTime=${lastTime}` : '';
        const url = `${process.env.REACT_APP_DEV_URL}/api/room${lastDateTimeParam}`;
        const data = await axiosInstance.get(url);
        return data.data.data;
    };

    let flag = false;

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRooms(null);
            setRoomList(data);
            setCurrentPage(1);
        };

        if (flag === false) {
            fetchData()
            flag = true;
        }
    }, []);

    useEffect(() => {
        const sliceEndIndex = currentPage * PAGE_SIZE;
        setDisplayedRooms(roomList.slice(0, sliceEndIndex));
    }, [roomList, currentPage]);

    const handleScroll = async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            if ((currentPage + 1) * PAGE_SIZE <= roomList.length) {
                setCurrentPage(currentPage + 1);
            } else {
                const lastRoom = roomList[roomList.length - 1];
                const newRooms = await fetchRooms(lastRoom.createdAt);
                setRoomList((prevRooms) => [...prevRooms, ...newRooms]);
                setCurrentPage(currentPage + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleSearch = async (query: string) => {
        if (query) {
            const url = `${process.env.REACT_APP_DEV_URL}/api/room/${query}`;
            const data = await axiosInstance.get(url);
            setRoomList(data.data.data);
            setCurrentPage(1);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-1/2">
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="h-32 flex items-center">
                {/* {memberInfo.mentor && ( */}
                    <button
                        className="py-2 px-4 bg-transparent text-accent-300 font-semibold border border-accent-300 rounded hover:bg-accent-500 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                        onClick={handleOpenModal}>
                        방 생성
                    </button>
                {/* )} */}
            </div>
            <div className='w-full'>
                <RoomList events={events} rooms={displayedRooms}></RoomList>
            </div>
            {isModalOpen && <CreateRoomModal onClose={() => {setIsModalOpen(false); window.location.reload();}} events={events} />}
        </div>
    );
};

export default LiveList;
