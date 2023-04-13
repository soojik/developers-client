// import React, {useState} from 'react';
// import {Room} from "./RoomList"
// import Popup from './PopUp';
// import axios from 'axios';

// interface ShowMentorOptionProps {
//     room:Room,
//     handleClose: () => void
// }
// const ShowMentorOption:React.FC<ShowMentorOptionProps> = ({handleClose, room}) => {

//         const handleDelete = async () => {
//             if(window.confirm("방을 삭제하시겠습니까?")){
//                 const url = `http://localhost:9002/api/room/${room.mentoringRoomId}`
//                 const res = await axios.delete(url);
//                 console.log(res.data.msg);
//                 handleClose;
//             }
//         }
    
//     return (
//         <div>
//             <Popup>
//                 <div>
//                     <h2>{room.title}</h2> 
//                     <button>수정</button>
//                     <button onClick={handleDelete}>삭제</button>
//                 </div>
//             </Popup>
//         </div>
//     );
// };

// export default ShowMentorOption;