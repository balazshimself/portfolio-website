'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/ui/modules';
import Link from 'next/link';

const Scene = dynamic(() => import('@/webgl/Scene'), { ssr: false });

export function Layout({ children }) {
    const ref = useRef(null);
    const pathname = usePathname();

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                touchAction: 'auto',
            }}
        >
            <Header>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        gap: '0.5rem',
                        flexDirection: 'column',
                    }}
                >
                    <h1>Kinetic Images</h1>
                    <nav
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            opacity: 0.6,
                        }}
                    >
                        {/* <a href="https://tympanus.net/codrops/?p=96765">Article</a>
                        <a href="https://github.com/DGFX/codrops-kinetic-images">Code</a>
                        <a href="https://tympanus.net/codrops/demos/">All demos</a> */}
                    </nav>
                    <nav
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            opacity: 0.6,
                        }}
                    >
                        <a href="https://tympanus.net/codrops/demos/?tag=3d">#3d</a>
                        <a href="https://tympanus.net/codrops/demos/?tag=three-js">#three.js</a>
                        <a href="https://tympanus.net/codrops/demos/?tag=react-three-fiber">
                            #react-three-fiber
                        </a>
                    </nav>
                </div>
            </Header>
            {children}
            <div className="relative z-[1000] p-8 bg-black/80 backdrop-blur-[10px] border-t border-white/10">
                <div className="flex w-full gap-2 flex-col">
                    <h2 className="m-0 text-xl font-normal">About This Demo</h2>
                    <div className="flex w-full gap-2 text-sm opacity-80 flex-wrap">
                        <span>Custom scroll behavior along banner normal vector</span>
                        <span>•</span>
                        <span>React Three Fiber implementation</span>
                        <span>•</span>
                        <span>WebGL kinetic images</span>
                    </div>
                    <nav className="flex w-full gap-2 text-sm opacity-60 mt-2">
                        <a
                            href="https://tympanus.net/codrops/?p=96765"
                            className="hover:opacity-100 transition-opacity"
                        >
                            Article
                        </a>
                        <a
                            href="https://github.com/DGFX/codrops-kinetic-images"
                            className="hover:opacity-100 transition-opacity"
                        >
                            Source Code
                        </a>
                        <a
                            href="https://tympanus.net/codrops/demos/"
                            className="hover:opacity-100 transition-opacity"
                        >
                            All Demos
                        </a>
                    </nav>
                </div>
            </div>
            <Footer>
                <div className="flex w-full gap-2 text-sm opacity-60 justify-center">
                    <span>© 2025 Kinetic Images Demo</span>
                    <span>•</span>
                    <span>Built with React Three Fiber</span>
                </div>
            </Footer>
            <Scene
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                }}
                eventSource={ref}
                eventPrefix="client"
            />
        </div>
    );
}
