import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    //Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    //Run ffmpeg commands
    await ffmpeg.run('-i', 'test.mp4', '-t', '4.0', '-ss', '2.0', '-f', 'gif', 'out.gif');
    //Read result
    const data = ffmpeg.FS('readFile', 'out.gif');
    //create URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  };

  // [] only run once when component is initialized
  useEffect(() => {
    load();
  }, []);
  return ready ? (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <h1 className="text-6xl font-normal leading-normal mt-0 mb-2 text-blue-800">
        Video2Gif Converter
      </h1>
      <h2 className="text-5xl font-normal leading-normal mt-0 mb-2 text-blue-800">Select Video</h2>
      <p className="max-w-prose text-lg font-light leading-relaxed mt-6 mb-4">
        I will be the leader of a company that ends up being worth billions of dollars, because I
        got the answers. I understand culture. I am the nucleus. I think that’s a responsibility
        that I have, to push possibilities, to show people, this is the level that things could be
        at.
      </p>
      {video && <video controls className="w-auto" src={URL.createObjectURL(video)}></video>}
      <div class="flex mt-4 mb-4 items-center justify-center bg-grey-lighter">
        <label class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
          <svg
            class="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span class="mt-2 text-base leading-normal">Select a file</span>
          <input
            className="hidden"
            type="file"
            onChange={(e) => setVideo(e.target.files?.item(0))}
          />
        </label>
      </div>
      <h2 className="text-5xl font-normal leading-normal mt-0 mb-2 text-blue-800">Result</h2>
      <p className="max-w-prose text-lg font-light leading-relaxed mt-6 mb-4">
        I will be the leader of a company that ends up being worth billions of dollars, because I
        got the answers. I understand culture. I am the nucleus. I think that’s a responsibility
        that I have, to push possibilities, to show people, this is the level that things could be
        at.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={convertToGif}
      >
        Convert
      </button>
      {gif && (
        <a href={gif} download>
          Click to download
        </a>
      )}
      {gif && <img src={gif} className="mt-4 mb-8 w-auto" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
