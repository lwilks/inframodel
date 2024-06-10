import React, { useState } from 'react';
import ThreeDView from './ThreeDView';
import TwoDView from './TwoDView';

const App: React.FC = () => {
    const [mode, setMode] = useState<'2D' | '3D'>('3D');

    const handleToggleMode = () => {
        setMode(prevMode => prevMode === '2D' ? '3D' : '2D');
    };

    return (
        <div>
            <button onClick={handleToggleMode}>
                {mode === '2D' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="m68.983 382.642l171.35 98.928a32.082 32.082 0 0 0 32 0l171.352-98.929a32.093 32.093 0 0 0 16-27.713V157.071a32.092 32.092 0 0 0-16-27.713L272.334 30.429a32.086 32.086 0 0 0-32 0L68.983 129.358a32.09 32.09 0 0 0-16 27.713v197.858a32.09 32.09 0 0 0 16 27.713ZM272.333 67.38l155.351 89.691v177.378l-155.351-87.807Zm-16.051 206.947l157.155 88.828l-157.1 90.7l-157.158-90.73ZM84.983 157.071l155.35-89.691v179.2l-155.35 87.81Z"/></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 20.85c1.78-.7 1.39-2.63.49-3.85c-.89-1.25-2.12-2.11-3.36-2.94A9.817 9.817 0 0 1 4.54 12c-.28-.33-.85-.94-.27-1.06c.59-.12 1.61.46 2.13.68c.91.38 1.81.82 2.65 1.34l1.01-1.7C8.5 10.23 6.5 9.32 4.64 9.05c-1.06-.16-2.18.06-2.54 1.21c-.32.99.19 1.99.77 2.77c1.37 1.83 3.5 2.71 5.09 4.29c.34.33.75.72.95 1.18c.21.44.16.47-.31.47c-1.24 0-2.79-.97-3.8-1.61l-1.01 1.7c1.53.94 4.09 2.41 5.96 1.79m11.09-15.6c.22-.22.22-.58 0-.79l-1.3-1.3a.562.562 0 0 0-.78 0l-1.02 1.02l2.08 2.08M11 10.92V13h2.08l6.15-6.15l-2.08-2.08L11 10.92Z"/></svg>
                }
            </button>

            {mode === '3D' ? <ThreeDView /> : <TwoDView />}
        </div>
    );
};

export default App;