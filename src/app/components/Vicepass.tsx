'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/css/VicePass.module.css';

export default function VicePass() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const [thumbWidth, setThumbWidth] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        const thumb = thumbRef.current;
        const track = trackRef.current;

        if (!el || !thumb || !track) return;

        const updateThumb = () => {
            const visibleRatio = el.clientWidth / el.scrollWidth;
            const trackWidth = track.clientWidth;
            const newThumbWidth = trackWidth * visibleRatio;
            setThumbWidth(newThumbWidth);

            const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
            const left = scrollRatio * (trackWidth - newThumbWidth);
            thumb.style.left = `${left}px`;
        };

        const onWheel = (e: WheelEvent) => {
            if (el.scrollWidth > el.clientWidth) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };

        // Drag behavior
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            startX = e.clientX;
            startScrollLeft = el.scrollLeft;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging || !thumb || !track || !el) return;
            const dx = e.clientX - startX;
            const scrollableWidth = el.scrollWidth - el.clientWidth;
            const trackWidth = track.clientWidth - thumb.offsetWidth;
            const scrollRatio = scrollableWidth / trackWidth;
            el.scrollLeft = startScrollLeft + dx * scrollRatio;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        thumb.addEventListener('mousedown', onMouseDown);
        el.addEventListener('scroll', updateThumb);
        el.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('resize', updateThumb);
        updateThumb();

        return () => {
            thumb.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('scroll', updateThumb);
            el.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', updateThumb);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);



    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className={styles.VicePass}>
            <div className={styles.title}>
                <img src="vicepass.gif" alt="VicePass" />
                VicePass - Saison 1
            </div>

            <div className={styles.scrollContainer} onWheel={handleWheel}>
                <div className={styles.scrollInner} ref={scrollRef}>
                    <div className={styles.contentPass}>
                        <div className={styles.free}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className={styles.item}></div>
                            ))}
                        </div>
                        <div className={styles.vip}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className={styles.item}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.scrollbarTrack} ref={trackRef}>
                    <div
                        className={styles.scrollbarThumb}
                        ref={thumbRef}
                        style={{ width: `${thumbWidth}px` }}
                    />
                </div>
            </div>
        </div>
    );
}
