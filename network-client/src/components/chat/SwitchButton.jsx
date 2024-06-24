import React, { useEffect, useState } from "react";

const SwitchableButton = ({ leftTitle, rightTitle, onSwitch }) => {
    const [focusedTitle, setFocusedTitle] = useState(leftTitle);

    const titlesStyle = {
        focus: { fontWeight: 'bold' },
        normal: { fontWeight: 'normal' },
    };

    const handleClick = (value) => () => {
        if(focusedTitle != value) {
            setFocusedTitle(value);
        }
    };

    useEffect(()=> {
        onSwitch(focusedTitle);
    }, [focusedTitle])



    return (
        <div className="row text-center" id="chat-list-choices">
            <button
                className="btn btn-link col text-decoration-none text-dark"
                type="button"
                style={focusedTitle === leftTitle ? titlesStyle.focus : titlesStyle.normal}
                onClick={handleClick(leftTitle)}
            >
                {leftTitle}
            </button>
            <button
                className="btn btn-link col text-decoration-none text-dark"
                type="button"
                style={focusedTitle === rightTitle ? titlesStyle.focus : titlesStyle.normal}
                onClick={handleClick(rightTitle)}
            >
                {rightTitle}
            </button>
        </div>
    );
};

export default SwitchableButton;