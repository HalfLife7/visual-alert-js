import React, { useState, useEffect } from "react";

const ExclamationMarkAlert: React.FC = ({xPosition, yPosition}) => {
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        setAnimating(true);

        const timeoutId = setTimeout(() => {
            setAnimating(false);
        }, 1000); // Set the duration you want in milliseconds

        return () => {
            // Clear the timeout if the component unmounts or the dependency changes
            clearTimeout(timeoutId);
        };
    }, [xPosition, yPosition]);

    return (
        <div
            style={{top: yPosition, left: xPosition, display: animating ? 'block' : 'none'}}
        >
            !
        </div>
    )
}

export default ExclamationMarkAlert;