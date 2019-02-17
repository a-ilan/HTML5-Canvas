import React from 'react';

class CanvasView extends React.Component {
    constructor(props) {
        super(props);
        this.name = props.renderer.name + Math.random();
        this.handleClick = this.handleClick.bind(this);
        this.renderer = new this.props.renderer(this.name);
    }

    handleClick() {
        this.renderer.render();
    }

    componentWillMount(){
    }

    //after render
    componentDidMount() {
        this.renderer.render();
    }

    componentWillUnmount() {
    }

    render() {
        let style = { 'border': '1px solid #999999', 'margin': '5px' };
        return <canvas id={this.name} width="640" height="360" style={style} onClick={this.handleClick}>
            Browser does not support the canvas element.
            </canvas>;
    }
};

export default CanvasView;