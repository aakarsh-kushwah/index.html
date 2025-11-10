import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import './GleamGlamVideoCarousel.css';

// Define your product videos here.
// IMPORTANT: For production, host these videos on a CDN (e.g., Cloudflare, AWS S3+CloudFront, Google Cloud Storage+CDN)
// Replace './HarshitaGleam&glam.mp4' with the actual CDN URL:
// Example: https://your-cdn-domain.com/videos/HarshitaGleam&glam.mp4
const productVideos = [
    {
        id: 1,
        title: "Glowing Skin Routine",
        src: "./HarshitaGleam&glam.mp4", // Replace with CDN URL in production
        poster: "./harshita-poster.jpg", // Add a small poster image for lazy loading
    },
    {
        id: 2,
        title: "Product Unboxing",
        src: "./anushkagleam&glam.mp4", // Replace with CDN URL in production
        poster: "./anushka-poster.jpg", // Add a small poster image for lazy loading
        
    },

    {
        id: 3,
        title: "benefits of Kit",
        src: "./pragati_Gleam&glam.mp4", // Replace with CDN URL in production
        poster: "./anushka-poster.jpg", // Add a small poster image for lazy loading
        
    },
];


function GleamGlamVideoCarousel() {
    const videoRefs = useRef({}); // This will hold references to the <video> elements
    const [mutedStates, setMutedStates] = useState({});
    const [activeAudioVideoId, setActiveAudioVideoId] = useState(null);
    // New state to track if video source has been loaded (lazy loading)
    const [videoLoadedStates, setVideoLoadedStates] = useState({});

    // Initialize muted and videoLoaded state for all videos on component mount
    useEffect(() => {
        const initialMutedStates = {};
        const initialLoadedStates = {};
        productVideos.forEach(video => {
            initialMutedStates[video.id] = true; // All videos start muted
            initialLoadedStates[video.id] = false; // Videos are initially not loaded
        });
        setMutedStates(initialMutedStates);
        setVideoLoadedStates(initialLoadedStates);
    }, []);

    // Intersection Observer to handle play/pause and LAZY LOADING based on video visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videoElement = entry.target;
                    const videoId = parseInt(videoElement.dataset.videoId, 10);

                    if (entry.isIntersecting) {
                        // Mark video as loaded when it enters view (or is about to enter view)
                        if (!videoLoadedStates[videoId]) {
                            setVideoLoadedStates(prev => ({ ...prev, [videoId]: true }));
                            // You might want to explicitly call videoElement.load() here if you're
                            // dynamically setting the src attribute after this state change.
                            // For <source> tag, setting the 'loaded' state will trigger re-render
                            // and include the actual src, then the browser will load it.
                        }

                        // Play video when it enters view (only after it's loaded)
                        if (videoLoadedStates[videoId]) { // Ensure video source is set
                            videoElement.play().catch(error => console.log(`Video ${videoId} autoplay prevented:`, error));
                            // Mute if it's not the active audio video
                            videoElement.muted = (activeAudioVideoId !== videoId);
                            setMutedStates(prev => ({ ...prev, [videoId]: (activeAudioVideoId !== videoId) }));
                        }
                    } else {
                        // Pause and mute video when it leaves view
                        videoElement.pause();
                        videoElement.muted = true;
                        setMutedStates(prev => ({ ...prev, [videoId]: true }));
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the video is visible
        );

        // Observe each video element
        Object.values(videoRefs.current).forEach(videoElement => {
            if (videoElement) {
                observer.observe(videoElement);
            }
        });

        // Cleanup observer on component unmount
        return () => {
            Object.values(videoRefs.current).forEach(videoElement => {
                if (videoElement) {
                    observer.unobserve(videoElement);
                }
            });
        };
    }, [activeAudioVideoId, videoLoadedStates]); // Re-run if active audio video or loaded state changes

    // Function to handle click on video to toggle its audio and make it the active audio
    const handleVideoTapForAudio = useCallback((videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (!videoElement) return;

        // Ensure video is loaded before trying to play/unmute
        if (!videoLoadedStates[videoId]) {
            setVideoLoadedStates(prev => ({ ...prev, [videoId]: true }));
            // Add a small delay if needed, or ensure component re-renders and video.load() is called
            setTimeout(() => {
                if (videoRefs.current[videoId]) {
                    videoRefs.current[videoId].load(); // Explicitly load the video
                    videoRefs.current[videoId].play().catch(error => console.log("Video play prevented after load:", error));
                }
            }, 50); // Small delay to allow source to update
        }

        // Step 1: Handle audio logic
        if (activeAudioVideoId === videoId) {
            // If the tapped video is already active audio, mute it
            videoElement.muted = true;
            setActiveAudioVideoId(null); // No video is active audio
        } else {
            // If another video was active audio, mute it first
            if (activeAudioVideoId && videoRefs.current[activeAudioVideoId]) {
                videoRefs.current[activeAudioVideoId].muted = true;
                setMutedStates(prev => ({ ...prev, [activeAudioVideoId]: true }));
            }
            // Set the tapped video as the active audio and unmute it
            videoElement.muted = false;
            setActiveAudioVideoId(videoId);
        }
        // Update the muted state for the tapped video
        setMutedStates(prev => ({ ...prev, [videoId]: videoElement.muted }));

        // Ensure the video plays (in case it was paused or to restart it)
        // This will only work if the video source is loaded
        if (videoLoadedStates[videoId]) {
            videoElement.play().catch(error => console.log("Video play prevented:", error));
        }


        // Step 2: Scroll the video card into view and center it
        const videoCardElement = videoElement.closest('.video-item-card');
        if (videoCardElement) {
            videoCardElement.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, [activeAudioVideoId, videoLoadedStates]); // Dependencies for useCallback

    // Fullscreen toggle function for individual videos
    const handleVideoFullscreen = useCallback((videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            // Ensure video is loaded before going fullscreen
            if (!videoLoadedStates[videoId]) {
                setVideoLoadedStates(prev => ({ ...prev, [videoId]: true }));
                setTimeout(() => { // Small delay to allow source to update
                    if (videoRefs.current[videoId]) {
                        videoRefs.current[videoId].load(); // Explicitly load
                        // Then request fullscreen
                        if (videoRefs.current[videoId].requestFullscreen) {
                            videoRefs.current[videoId].requestFullscreen();
                        } else if (videoRefs.current[videoId].mozRequestFullScreen) { /* Firefox */
                            videoRefs.current[videoId].mozRequestFullScreen();
                        } else if (videoRefs.current[videoId].webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                            videoRefs.current[videoId].webkitRequestFullscreen();
                        } else if (videoRefs.current[videoId].msRequestFullscreen) { /* IE/Edge */
                            videoRefs.current[videoId].msRequestFullscreen();
                        }
                    }
                }, 100);
            } else {
                 if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) { /* Firefox */
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
                    videoElement.msRequestFullscreen();
                }
            }
        }
    }, [videoLoadedStates]); // Dependency for useCallback


    return (
        <Container fluid className="gleam-glam-video-section-container">
            <div className="product-video-section text-center mb-5">
                <h2 className="section-title">Discover Our Products in Action!</h2>

                <div className="video-row-wrapper">
                    {productVideos.map((video) => (
                        <div
                            key={video.id}
                            className={`video-item-card ${activeAudioVideoId === video.id ? 'active-audio' : ''}`}
                        >
                            <div className="video-container-row" onClick={() => handleVideoTapForAudio(video.id)}>
                                <video
                                    ref={el => videoRefs.current[video.id] = el}
                                    data-video-id={video.id}
                                    width="100%"
                                    height="auto"
                                    controls={false}
                                    muted={mutedStates[video.id]}
                                    playsInline
                                    loop
                                    preload="none" // KEY CHANGE: Prevents automatic download
                                    poster={video.poster} // KEY CHANGE: Shows an image while video is not loaded
                                    className="video-element-row"
                                >
                                    {videoLoadedStates[video.id] && ( // Only include <source> tag if video is "loaded"
                                        <source src={video.src} type="video/mp4" />
                                    )}
                                    Your browser does not support the video tag.
                                </video>
                                <div className="video-overlay-row">
                                    <div className="video-controls-row">
                                        <Button
                                            variant="light"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVideoTapForAudio(video.id);
                                            }}
                                            className="mute-button-row"
                                            title={mutedStates[video.id] ? "Unmute" : "Mute"}
                                        >
                                            <i className={`fas ${mutedStates[video.id] ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                                        </Button>
                                        <Button
                                            variant="light"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVideoFullscreen(video.id);
                                            }}
                                            className="fullscreen-button-row"
                                            title="Fullscreen"
                                        >
                                            <i className="fas fa-expand"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="video-caption-row">
                                <h3>{video.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default GleamGlamVideoCarousel;