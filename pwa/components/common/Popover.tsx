"use client"
import React, {useEffect, useRef, useState} from "react";

const Popover = ({children, content, title, trigger = "hover", size = 300}:
                     { children: React.ReactNode, content: React.ReactNode, title?: string, trigger?: string, size?: number }) => {
    const [show, setShow] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseOver = () => {
        if (trigger === "hover") {
            setShow(true);
        }

    };

    const handleMouseLeft = () => {
        if (trigger === "hover") {
            setShow(false);
        }

    };

    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (wrapperRef.current &&
                event.target instanceof Node &&
                !wrapperRef.current.contains(event.target)) {
                setShow(false);
            }
        }

        if (show) {
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [show, wrapperRef]);

    return (
        <div
            ref={wrapperRef}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeft}
            className="w-fit h-fit relative flex justify-center">
            <button
                onClick={() => setShow(!show)}
                aria-haspopup="dialog"
                aria-expanded={show}
                className="focus:outline-none"
            >
                {children}
            </button>
            <div
                hidden={!show}
                className={`min-w-fit h-fit absolute right-[100%] bottom-[100%] z-50 transition-all`}
                style={{width: `${size}px`}}
            >
                <div className="rounded bg-white text-black p-3 shadow-[10px_30px_150px_rgba(46,38,92,0.25)] mb-[10px]">
                    {title && <>
                        <h3 className="items-center mx-auto p-3">{title}</h3>
                        <hr/>
                    </>
                    }
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Popover;