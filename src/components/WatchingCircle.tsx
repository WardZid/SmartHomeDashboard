import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface WatchingCircleProps {
    innerCircleColor: string;
    outerCircleColor: string;
}

const WatchingCircle: React.FC<WatchingCircleProps> = ({ innerCircleColor, outerCircleColor  }) => {
    const navigate = useNavigate();
    const svgRef = useRef<SVGSVGElement>(null);
    const [innerCirclePosition, setInnerCirclePosition] = useState<{ x: number; y: number }>({ x: 16, y: 24 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (svgRef.current) {
                const svgRect = svgRef.current.getBoundingClientRect();
                const centerX = svgRect.width / 2;
                const centerY = svgRect.height / 2;
                const mouseX = event.clientX - svgRect.left;
                const mouseY = event.clientY - svgRect.top;

                // Calculate the vector from the center to the mouse
                const dx = mouseX - centerX;
                const dy = mouseY - centerY;

                // Calculate the length of the vector
                const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

                // Calculate the normalized vector and scale it to the desired distance
                const scale = 8 / distanceFromCenter;
                const innerX = centerX + dx * scale;
                const innerY = centerY + dy * scale;

                setInnerCirclePosition({ x: innerX, y: innerY });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleEyeClick = () => {
        navigate("/");
    };
    return (
        <>
            <svg 
            className="cursor-pointer"
            ref={svgRef} width="32" height="32" xmlns="http://www.w3.org/2000/svg"
            onClick={handleEyeClick}>
                <circle cx="16" cy="16" r="16" fill={outerCircleColor} stroke="black" strokeWidth="0" />
                <circle cx={innerCirclePosition.x} cy={innerCirclePosition.y} r="4" fill={innerCircleColor} stroke="black" strokeWidth="0" />
            </svg>
        </>
    );
};

export default WatchingCircle;
