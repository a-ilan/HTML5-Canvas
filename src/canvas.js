import React from 'react';

class CanvasView extends React.Component {
    constructor(props) {
        super(props);
        this.name = props.renderer.name + Math.random();
        this.handleClick = this.handleClick.bind(this);
        this.renderer = new this.props.renderer(this.name);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    handleClick() {
        this.renderer.render();
    }

    updateDimensions() {
        if(this.state.screen === "desktop"){
            if(window.innerWidth < 640){
                this.setState({
                    width: "400", height: "300", screen: "mobile"
                });
                this.renderer.render();
            }
        } else if(this.state.screen === "mobile"){
            if(window.innerWidth > 700){
                this.setState({
                    width: "640", height: "360", screen: "desktop"
                });
                this.renderer.render();
            }
        }
    }

    componentWillMount(){
        if(window.innerWidth < 640){
            this.setState({
                width: "400", height: "300", screen: "mobile"
            });
        } else {
            this.setState({
                width: "640", height: "360", screen: "desktop"
            });
        }
    }

    //after render
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.renderer.render();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        let style = { 'border': '1px solid #999999', 'margin': '5px' };
        return <canvas id={this.name} width={this.state.width} height={this.state.height} style={style} onClick={this.handleClick}>
            Browser does not support the canvas element.
            </canvas>;
    }
};

export default CanvasView;