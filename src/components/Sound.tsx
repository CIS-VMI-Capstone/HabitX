import React from "react";
import useSound from 'use-sound';

import AddTaskSfx from "../resources/sounds/AddTask.mp3";
import CompletionSfx from "../resources/sounds/Completion.mp3";
import deleteTaskSfx from "../resources/sounds/deleteTask.mp3";

const SoundButtons: React.FC = () =>{
    const [playAdd] = useSound(AddTaskSfx, {volume: 1});
    const [playCompletion] = useSound(CompletionSfx, {volume: 1});
    const [playDelete] = useSound(deleteTaskSfx, {volume: 1});

    return (
        <>
        <button onClick={() => playAdd}>Added task</button>

        <button onClick={() => playCompletion}>Completed task</button>

        <button onClick={() => playDelete}>Deleted task</button>
    
        </>
    );
};

export default SoundButtons;

