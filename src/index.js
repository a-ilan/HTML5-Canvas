import React from 'react';
import ReactDOM from 'react-dom';
import CanvasView from './canvas';
import Tree from './tree';
import Maze from './maze';
import Cave from './cave';
import Dungeon from './dungeon';

class MyApp extends React.Component{

	render(){
		return (
			<div>
				<CanvasView renderer={Tree}/>
				<CanvasView renderer={Maze}/>
				<CanvasView renderer={Cave}/>
				<CanvasView renderer={Dungeon}/>
			</div>
		);
	}
}

ReactDOM.render(
	<MyApp />,
	document.getElementById('app')
);