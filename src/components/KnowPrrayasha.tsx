"use client";
import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import apiHome from "@/apiProvider/home.provider";
import { IMAGE_BASE_URL } from "@/lib/api-client";

interface KnowVideoProps {
    title: string;
    videoId: string;
    image?: string;
}

export default function KnowPrrayasha() {
    const [activeVideo, setActiveVideo] = useState<KnowVideoProps | null>(null);
    const [videos, setVideos] = useState<KnowVideoProps[]>([]);
    const [loading, setLoading] = useState(true);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : "";
    };

    const fetchVideos = async () => {
        try {
            const res = await apiHome.getYoutubeList();
            if (res.status && res.response && res.response.data) {
                const mappedVideos = res.response.data.map((item: any) => ({
                    title: "Prrayasha Video",
                    videoId: getYouTubeId(item.url),
                    image: item.image?.path ? `${IMAGE_BASE_URL}/${item.image.path}` : null
                }));
                setVideos(mappedVideos.filter((v: any) => v.videoId));
            }
        } catch (error) {
            console.error("Error fetching youtube videos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    if (loading || videos.length === 0) {
        return null;
    }

    return (
        <section className="know-prrayasha-section">
            <div className="section-container">
                <div style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#36533f', fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>Behind The Brand</span>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Know Prrayasha Collections</h2>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, #36533f, transparent)' }}></div>
                </div>

                <div className="know-grid">
                    {videos.map((video, index) => (
                        <button
                            key={index}
                            type="button"
                            className="know-video-card know-video-trigger"
                            onClick={() => setActiveVideo(video)}
                            aria-label={`Play ${video.title}`}
                        >
                            <div className="know-video-thumb">
                                <img
                                    src={video.image || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                                    alt={video.title}
                                />
                                <span className="know-video-play-small">
                                    <Play size={14} fill="currentColor" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {activeVideo && (
                <div className="know-video-modal" onClick={() => setActiveVideo(null)}>
                    <div className="know-video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="know-video-close"
                            onClick={() => setActiveVideo(null)}
                            aria-label="Close video"
                        >
                            <X size={18} />
                        </button>
                        <div className="know-video-embed">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                                title={activeVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="know-video-iframe"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
