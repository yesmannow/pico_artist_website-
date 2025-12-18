'use client';

import { useMemo, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
      .then(() => {
        setInit(true);
      })
      .catch((error) => {
        console.error('Failed to initialize particles engine:', error);
        // Set init to true to allow component to render without particles
        setInit(true);
      });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ['#00f5d4', '#ff006e', '#ff9e00'], // Piko Teal, Pink, Orange
        },
        links: {
          color: '#00f5d4',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 50,
        },
        opacity: {
          value: 0.3,
          animation: {
            enable: true,
            speed: 0.5,
            startValue: 'random',
            mode: 'random',
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            startValue: 'random',
            mode: 'random',
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Particles
        id="tsparticles"
        options={options}
      />
    </div>
  );
}
