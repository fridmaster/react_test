import "./App.css";
import { useEffect, useReducer, useRef, useState } from "react";
import { Routes, Route, useParams, Link } from "react-router-dom";
const BE_ROUTE = "http://localhost:3001";
const GET_MESSAGE_PATH = "/api/message";
const GET_CHAT = "/api/chat/";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="chat/:roomId" element={<ChatRoom />} />
		</Routes>
	);
}

export default App;

// function addTask(task){
//   setLoading(true)
//   fetch(`${beRoute}/addTask`, {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({task:task})
//   }).then(()=>{
//     setLoading(false)
//     setTaskList([...taskList, task]);
//     setTask('');
//   })
// }

function Home() {
	const [task, setTask] = useState("");
	const [roomList, setRoomList] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const getMessage = setInterval(() => {
			fetch(`${BE_ROUTE}${GET_MESSAGE_PATH}`)
				.then((response) => response.json())
				.then(({ roomId, fromName, fromNumber, ...messageParams }) => {
					setRoomList((prev) => {
						let room = { roomid: roomId, name: fromName + " " + fromNumber, messageList: [messageParams] };
						if (prev[roomId]) {
							room = { ...prev[roomId], room, messageList: [...prev[roomId].messageList, messageParams] };
						}
						prev[roomId] = room;

						return { ...prev };
					});
				});
			return () => {
				clearInterval(getMessage);
			};
		}, 1000);
	}, []);

	return (
		<div className="flex jestify-items-center">
			<ul className="list-disc w-64">
				{Object.keys(roomList).map((roomId) => {
					return (
						<li className="bg-blue-200 p-2 my-2 rounded shadow hover:bg-blue-400" key={roomId}>
							<Link to={`chat/${roomId}`}>
								Name:{roomList[roomId].name}
								Count:{roomList[roomId].messageList.length}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
function ChatRoom() {
	let { roomId } = useParams();
	const [room, setRoom] = useState();
	useEffect(() => {
		fetch(`${BE_ROUTE}${GET_CHAT}${roomId}`)
			.then((res) => res.json())
			.then((roomData) => {
				setRoom(roomData);
			});
	}, []);
	if (!room) return null;
	return (
		<div>
			<div className="bg-red-300 flex justify-between items-center p-4">
				<div>
					<h1>ROOM:{roomId}</h1>
					<div>from: {room.fromName}</div>
				</div>
				<nav>
					<Link className="p-2 bg-blue-500 rounded" to="/">
						Back
					</Link>
				</nav>
			</div>

			<div className="flex flex-col mt-10">
				{room.body.map((message) => {
					return (
						<div
							className={`p-4 rounded  ${
								message.direction == "incoming" ? "self-start bg-blue-300" : "self-end bg-green-300"
							}`}
						>
							{message.body}
						</div>
					);
				})}
			</div>
		</div>
	);
}
