'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[15%] md:-top-[25%] h-[450px] w-[90%] md:w-[70%] rounded-2xl p-6 md:p-10 origin-top shadow-2xl border border-white/10`}
      >
        <h2 className='text-2xl md:text-3xl text-left font-bold text-white'>{title}</h2>
        <div className={`flex flex-col-reverse md:flex-row h-full mt-4 md:mt-5 gap-6 md:gap-10`}>
          <div className={`w-full md:w-[40%] relative md:top-[10%] flex flex-col justify-start`}>
            <p className='text-sm md:text-lg text-white/80 font-medium leading-relaxed'>{description}</p>
          </div>

          <div
            className={`relative w-full md:w-[60%] h-[150px] md:h-full rounded-xl overflow-hidden bg-black/40 ring-1 ring-white/10`}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              <img src={url} alt='image' className='absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay' />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ComponentRootProps {
  projects: ProjectData[];
  title?: string;
  subtitle?: string;
}

const Component = forwardRef<HTMLElement, ComponentRootProps>(({ projects, title, subtitle }, ref) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <div className='relative w-full'>
        <section className='text-white min-h-[40vh] w-full grid place-content-center relative z-10 py-20'>
          <h1 className='text-4xl md:text-6xl px-8 font-bold text-center tracking-tighter leading-[120%] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50'>
            {title || "Stacking Cards"}
          </h1>
          {subtitle && (
            <p className="text-neutral-400 mt-4 text-center max-w-xl mx-auto px-4 text-lg">
              {subtitle}
            </p>
          )}
        </section>

        <section ref={container} className='text-white w-full relative z-20 pb-[10vh]'>
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - 1 - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project.link}
                title={project.title}
                color={project.color}
                description={project.description}
                progress={scrollYProgress}
                range={[i * (1 / projects.length), 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </div>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;
