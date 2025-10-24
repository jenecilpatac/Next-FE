"use client";
import { useState, useRef, useEffect } from "react";

const Video = ({ url }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [timeFrame, setTimeFrame] = useState("");
  const [timeFramePosition, setTimeFramePosition] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isVisible, setIsVisible] = useState({
    forward: false,
    backward: false,
    pausePlay: false,
  });
  const timeoutId = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize video and update progress
  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const current = videoRef.current.currentTime;
        const totalDuration = videoRef.current.duration;
        setCurrentTime(current);
        setDuration(totalDuration);
        setProgress((current / totalDuration) * 100);
      }
    };

    const intervalId = setInterval(updateProgress, 100); // Update every 100ms
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleNextPrevKey = (e: any) => {
      if (videoRef && e.key === "ArrowRight") {
        nextFiveSeconds();
      } else if (videoRef && e.key === "ArrowLeft") {
        prevFiveSeconds();
      }
    };

    document.addEventListener("keydown", handleNextPrevKey);
    return () => {
      document.removeEventListener("keydown", handleNextPrevKey);
    };
  }, [videoRef]);

  const handleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
  };

  // Toggle Play/Pause
  const togglePlayPause = () => {
    setIsVisible({ ...isVisible, pausePlay: true });
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();

        setTimeout(() => {
          setIsVisible({ ...isVisible, pausePlay: false });
        }, 3000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Seek video forward or backward by 5 seconds
  const nextFiveSeconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
    setIsVisible({ ...isVisible, forward: true, backward: false });

    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      setIsVisible({ ...isVisible, forward: false });
    }, 500);
  };

  const prevFiveSeconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
    setIsVisible({ ...isVisible, backward: true, forward: false });

    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      setIsVisible({ ...isVisible, backward: false });
    }, 500);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Start dragging the button
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  // Drag the button
  const handleMouseMove = (e: any) => {
    if (!isDragging || !videoRef.current) return;

    const progressBar = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - progressBar.left;
    const newProgress = Math.min(
      Math.max((offsetX / progressBar.width) * 100, 0),
      100
    );
    setProgress(newProgress);
    videoRef.current.currentTime =
      (newProgress / 100) * videoRef.current.duration;
  };

  const handleMoveMouse = (e: any) => {
    if (progressBarRef.current && videoRef.current) {
      const progressBar = progressBarRef.current;
      const duration = videoRef.current.duration;

      const rect = progressBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const progressWidth = rect.width;

      const hoverPercentage = mouseX / progressWidth;
      const hoverTime = duration * hoverPercentage;
      const hoverTimeFormatted = `${Math.floor(hoverTime / 60)}:${Math.floor(
        hoverTime % 60
      )
        .toString()
        .padStart(2, "0")}`;
      setTimeFramePosition(hoverPercentage * 100);
      setTimeFrame(hoverTimeFormatted);
    }
  };

  // Stop dragging the button
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Prevent default behavior for drag on touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !videoRef.current) return;

    const progressBar = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const offsetX = touch.clientX - progressBar.left;
    const newProgress = Math.min(
      Math.max((offsetX / progressBar.width) * 100, 0),
      100
    );
    setProgress(newProgress);
    videoRef.current.currentTime =
      (newProgress / 100) * videoRef.current.duration;
  };

  // Stop dragging on touch
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle click on progress bar
  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!videoRef.current) return;

    const progressBar = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - progressBar.left; // Calculate the offset from the left of the progress bar
    const newProgress = (offsetX / progressBar.width) * 100; // Calculate the new progress percentage
    setProgress(newProgress);
    videoRef.current.currentTime =
      (newProgress / 100) * videoRef.current.duration; // Update video time
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`my-8 p-4 mx-auto ${
        isTheaterMode ? "max-w-full" : "max-w-5xl"
      }`}
    >
      {/* Video container */}
      <div className="relative">
        <div>
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-lg"
            src={url}
            controls={false}
            onClick={togglePlayPause}
            autoPlay
            muted
          />

          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {/* Left Block: Previous Button */}
            <div
              className={`flex items-center justify-center w-1/3 h-full transition-all duration-300 ease-in-out ${
                isVisible.backward ? "opacity-100 cursor-pointer" : "opacity-0"
              }`}
              onDoubleClick={prevFiveSeconds}
            >
              <div className="text-white p-3 flex gap-2 items-center rounded-3xl bg-black/30">
                <span>5s</span>
                <i className="fas fa-backward text-xl" />
              </div>
            </div>

            {/* Center Block: Play/Pause Button */}
            <div
              className="flex items-center justify-center w-1/3 h-full"
              onClick={togglePlayPause}
            >
              <div
                className={`text-white flex items-center transition-all duration-300 ease-in-out ${
                  isVisible.pausePlay
                    ? "opacity-100 cursor-pointer"
                    : "opacity-0"
                }`}
              >
                {isPlaying ? (
                  <i className="fas fa-pause text-xl bg-black/30 py-3 px-4 rounded-full" />
                ) : (
                  <i className="fas fa-play text-lg bg-black/30 py-[11.5px] px-4 rounded-full" />
                )}
              </div>
            </div>

            {/* Right Block: Next Button */}
            <div
              className={`flex items-center gap-2 justify-center w-1/3 h-full transition-all duration-300 ease-in-out ${
                isVisible.forward ? "opacity-100 cursor-pointer" : "opacity-0"
              }`}
              onDoubleClick={nextFiveSeconds}
            >
              <div className="text-white p-3 gap-2 flex items-center rounded-3xl bg-black/30">
                <i className="fas fa-forward text-xl" /> <span>5s</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 w-full px-2 z-50">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="relative mt-2 cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleProgressBarClick}
          >
            {/* Progress Line */}
            <div className="group">
              <div
                className="h-1 bg-gray-300 w-full rounded-full"
                onMouseMove={handleMoveMouse}
              >
                <div
                  className="h-1 bg-red-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Time Circle */}
              <div
                className="absolute top-0.5 left-0 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full cursor-pointer"
                style={{ left: `${progress}%` }}
              ></div>

              <div
                style={{ left: `${timeFramePosition}%` }}
                className="absolute bottom-4 left-0 w-fit h-auto p-2 bg-black/75 rounded-md group-hover:block hidden"
              >
                {timeFrame}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full px-5">
          {/* Controls */}
          <div className="flex justify-between z-50 items-center">
            <div className="flex gap-1 items-center">
              {/* Prev 5 seconds */}
              <button
                onClick={prevFiveSeconds}
                className="text-white py-2 px-1 rounded-lg"
              >
                <i className="fas fa-backward text-xl" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="text-white py-2 px-1 rounded-lg"
              >
                {isPlaying ? (
                  <i className="fas fa-pause text-xl" />
                ) : (
                  <i className="fas fa-play text-xl" />
                )}
              </button>

              {/* Next 5 seconds */}
              <button
                onClick={nextFiveSeconds}
                className="text-white py-2 px-1 rounded-lg"
              >
                <i className="fas fa-forward text-xl" />
              </button>

              {/* Duration */}
              <div className="text-center">
                <p className="text-white text-sm">
                  <span>{`${Math.floor(currentTime / 60)}:${Math.floor(
                    currentTime % 60
                  )}`}</span>{" "}
                  /{" "}
                  {`${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Fullscreen Button */}
              <button
                onClick={handleTheaterMode}
                className="text-white py-2 px-1 rounded-lg"
              >
                {isTheaterMode ? (
                  <i className="far fa-rectangle text-xl" />
                ) : (
                  <i className="far fa-rectangle-wide text-xl" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-white py-2 px-1 rounded-lg"
              >
                <i className="fas fa-expand text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
