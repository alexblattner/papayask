import imageCompression from 'browser-image-compression';
import React from 'react';

/**
 * compress size of image
 * @param {Blob} file
 * @param {number} maxSizeMB
 * @returns File of compressed image
 */

export default async function compressImage(
  file: File,
  maxSizeMB: number,
  ref: React.RefObject<HTMLImageElement>,
) {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 5740,
    initialQuality: 0.8,
    useWebWorker: true,
    onprogress: (progress: any) => {
      ref.current!.innerHTML = `Compressing... ${progress / 2}%`;
      ref.current!.style.background = `linear-gradient(to right, var(--primary) ${
        progress / 2
      }%, #aaa ${progress / 2}%)`;
    },
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}
