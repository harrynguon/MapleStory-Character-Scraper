import "./App.css";
import { Link } from "react-router-dom";

import _jsonData from "./character_list.json";

export default function App() {
	return (
		<div className="App">
			<header className="App-header">
				<ul>
					{_jsonData.character_list.map((user) => (
						<li>
							<Link to={`u/${user.username}`}>{user.username}</Link>
						</li>
					))}
				</ul>
			</header>
		</div>
	);
}
