import * as React from 'react';
import { SpecialZoomLevel, Viewer,Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import {FileProps,NoteProps} from '../Question.types';

import ZoomPlugin from './ZoomPlugin';

interface CustomZoomPluginExampleProps {
    file: FileProps,
    notes: NoteProps[],
    setNotes: Function
}

const Writing: React.FC<CustomZoomPluginExampleProps> = ({ file,notes,setNotes }) => {
    const customZoomPluginInstance = ZoomPlugin();
    const { zoomTo } = customZoomPluginInstance;
    const autoZoom= () => {
        zoomTo(SpecialZoomLevel.PageWidth);
    }
    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '50%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '8px',
                }}
            >
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(SpecialZoomLevel.ActualSize)}
                    >
                        Actual size
                    </button>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(SpecialZoomLevel.PageFit)}
                    >
                        Page fit
                    </button>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(SpecialZoomLevel.PageWidth)}
                    >
                        Page width
                    </button>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(0.5)}
                    >
                        50%
                    </button>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(1)}
                    >
                        100%
                    </button>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <button
                        style={{
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => zoomTo(1.5)}
                    >
                        150%
                    </button>
                </div>
            </div>
            <Worker
                workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
            >
                <Viewer onDocumentLoad={autoZoom} fileUrl={file.name} plugins={[customZoomPluginInstance]} />
            </Worker>
        </div>
    );
};

export default Writing;
