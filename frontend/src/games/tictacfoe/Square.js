import React from 'react'

function Square(props) {
    return (
    <button className={(props.isWin || props.isLightUp) ? "squareWin" : "square"} onClick={() => props.onClick()}>
        {/* {(props.value > -1) ? props.value : ""} */}
        { props.value }
    </button>
    );
}

export default Square;