export default function AboutPage() {
    return (
        <div
            style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url("/me-big.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
                // alignItems: 'center',
                zIndex: 1001,
                padding: '2rem',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(0, -50%)',
                    maxWidth: '600px',
                    gap: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <h1
                    style={{
                        fontSize: '5rem',
                        fontFamily: "'Robot Crush', sans-serif",
                    }}
                >
                    Kovács Balázs
                </h1>
                <div
                    style={{
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        fontSize: '1.2rem',
                        gap: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <p>
                        I'm Balázs, a 22-year-old creative developer based in Budapest. I specialize
                        in machine learning engineering and software development, with a passion for
                        creating immersive web experiences.
                    </p>
                    <p>
                        Currently working as a developer at Techstars 24' Voovo, I blend technical
                        expertise with creative vision to build innovative solutions that push the
                        boundaries of what's possible on the web.
                    </p>
                </div>
                <a
                    href="/"
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid white',
                        color: 'white',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    Back to Home &rarr;
                </a>
            </div>
        </div>
    );
}
