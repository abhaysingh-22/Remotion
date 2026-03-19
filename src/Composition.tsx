import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";
import React from "react";

const images = [
  "snapexx/onb1.png",
  "snapexx/onb2.png",
  "snapexx/onb3.png",
  "snapexx/home.png",
  "snapexx/history.png",
  "snapexx/premium.png",
  "snapexx/profile1.png",
  "snapexx/profile2.png",
  "snapexx/signup.png",
  "snapexx/signin.png",
  "snapexx/faqs.png",
  "snapexx/tos.png",
  "snapexx/Privacy.png",
  "snapexx/cookie.png",
  "snapexx/blog1.png",
  "snapexx/blog2.png",
  "snapexx/blog3.png",
  "snapexx/last.png",
];

const scenes = [
  { title: "Seamless Onboarding", startIndex: 0, count: 3, durationInFrames: 150 },
  { title: "Powerful Dashboard & History", startIndex: 3, count: 3, durationInFrames: 150 },
  { title: "User Management & Subscriptions", startIndex: 6, count: 4, durationInFrames: 200 },
  { title: "Fully Compliant & Secure", startIndex: 10, count: 4, durationInFrames: 200 },
  { title: "Rich Content & SEO Ready", startIndex: 14, count: 4, durationInFrames: 200 },
];

const Background = () => {
  const frame = useCurrentFrame();
  const config = useVideoConfig();
  const floatBgX = interpolate(frame, [0, config.durationInFrames], [0, -300]);
  const floatBgY = interpolate(frame, [0, config.durationInFrames], [0, -150]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #09090b 0%, #17153B 50%, #000000 100%)",
        backgroundSize: "200% 200%",
        backgroundPosition: `${floatBgX}px ${floatBgY}px`,
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          transform: `translateY(${(frame * 0.5) % 50}px)`,
        }}
      />
      {/* Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[150px] opacity-20 mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[200px] opacity-20 mix-blend-screen" />
    </AbsoluteFill>
  );
};

const BrowserWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0d1117] border border-gray-800/60"
      style={{
        width: 1280,
        height: 720,
        boxShadow:
          "0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 120px rgba(99, 102, 241, 0.2)",
      }}
    >
      {/* Top Bar */}
      <div className="h-12 bg-[#161b22]/90 backdrop-blur-md flex items-center px-5 border-b border-gray-800/60 gap-3 z-10 w-full">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-inner" />
        </div>
        <div className="flex-1 flex justify-center ml-[-50px]">
          <div className="h-7 w-[450px] bg-[#090b0f] rounded-lg border border-gray-700/50 flex items-center px-4 shadow-inner">
            <span className="text-gray-400 text-sm font-medium tracking-wide">
              🔒 snapexx.app
            </span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-black/50">
        {children}
      </div>
    </div>
  );
};

const SceneImages: React.FC<{
  startIndex: number;
  count: number;
  duration: number;
}> = ({ startIndex, count, duration }) => {
  const framesPerImage = duration / count;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const startFrame = i * framesPerImage;
        const endFrame = (i + 1) * framesPerImage;
        const localFrame = frame - startFrame;

        if (frame < startFrame - 10 || frame > endFrame + 10) return null;

        // Image entrance spring
        const imgScale = spring({
          fps,
          frame: localFrame,
          config: { damping: 100 },
        });

        const finalScale = interpolate(imgScale, [0, 1], [1.15, 1]);

        // Scroll simulation (pan down slightly)
        const scrollY = interpolate(localFrame, [0, framesPerImage], [0, -40], {
          extrapolateRight: "clamp",
        });

        // Opacity transition
        const opacity = interpolate(
          localFrame,
          [0, 15, framesPerImage - 15, framesPerImage],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" }
        );

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity,
              zIndex: Math.floor(opacity * 100),
            }}
          >
            <Img
              src={staticFile(images[startIndex + i])}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${finalScale}) translateY(${scrollY}px)`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneText: React.FC<{ title: string; duration: number }> = ({
  title,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const words = title.split(" ");

  return (
    <div className="absolute top-20 text-white w-full text-center flex flex-col items-center">
      <h1 className="text-6xl font-extrabold tracking-tight flex justify-center w-full pb-4">
        {words.map((word, i) => {
          const wordSpring = spring({
            fps,
            frame: frame - i * 6, // Stagger words
            config: { damping: 14, stiffness: 90 },
          });

          const wordY = interpolate(wordSpring, [0, 1], [30, 0]);
          const wordOp = interpolate(wordSpring, [0, 1], [0, 1]);

          return (
            <span
              key={i}
              className="inline-block mr-5 text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-300 drop-shadow-lg"
              style={{
                transform: `translateY(${wordY}px)`,
                opacity: wordOp,
              }}
            >
              {word}
            </span>
          );
        })}
      </h1>
      
      {/* Animated underline indicator */}
      <div className="relative h-1.5 bg-gray-800 rounded-full w-96 overflow-hidden mt-2">
         <div 
             className="absolute top-0 left-0 h-full bg-indigo-500 min-w-4 rounded-full"
             style={{
                 width: interpolate(
                     spring({ fps, frame: frame - 15, config: { damping: 30 } }), 
                     [0, 1], 
                     [0, 100]
                 ) + "%",
             }}
         />
      </div>
    </div>
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance and layout physics
  const entrance = spring({
    fps,
    frame,
    config: { mass: 1, damping: 18, stiffness: 70 },
  });

  // Global 3D camera pan
  const rotateX = interpolate(frame, [0, durationInFrames], [6, -2], {
    extrapolateRight: "clamp",
  });
  const rotateY = interpolate(frame, [0, durationInFrames], [-8, 8], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const yOffset = interpolate(entrance, [0, 1], [200, 30]); // Add 30px offset so it leaves room for text top

  return (
    <AbsoluteFill className="bg-black font-sans">
      <Background />

      {/* 3D Container */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: 1800 }}
      >
        <div
          style={{
            transform: `scale(${scale}) translateY(${yOffset}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <BrowserWindow>
            {scenes.map((scene, index) => {
              // Calculate out the start frame for each scene
              const startFrame = scenes
                .slice(0, index)
                .reduce((acc, curr) => acc + curr.durationInFrames, 0);

              return (
                <Sequence
                  key={scene.title}
                  from={startFrame}
                  durationInFrames={scene.durationInFrames}
                >
                  <SceneImages
                    startIndex={scene.startIndex}
                    count={scene.count}
                    duration={scene.durationInFrames}
                  />
                </Sequence>
              );
            })}
          </BrowserWindow>
        </div>
      </div>

      {/* Text Sequences (rendered flat over the 3D container) */}
      <AbsoluteFill className="pointer-events-none z-50">
        {scenes.map((scene, index) => {
          const startFrame = scenes
            .slice(0, index)
            .reduce((acc, curr) => acc + curr.durationInFrames, 0);

          return (
            <Sequence
              key={scene.title + "_text"}
              from={startFrame}
              durationInFrames={scene.durationInFrames}
            >
              <SceneText
                title={scene.title}
                duration={scene.durationInFrames}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};