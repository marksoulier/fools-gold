import { useEffect, useState } from 'react';

/*
Example

const enterPressed = useKeyPress("Enter");
*/

const useKeyPress = (targetKey: string): boolean => {
    const [pressed, setPressed] = useState(false);

    const downHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) setPressed(true);
    };

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [targetKey]);
    return pressed;
}
export default useKeyPress;
