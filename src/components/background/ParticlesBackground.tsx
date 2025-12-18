'use client';

import { useMemo } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { ISourceOptions } from 'tsparticles-engine';
import type { Engine } from 'tsparticles-engine';

export default function ParticlesBackground() {
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
          random: true,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* @ts-expect-error - react-tsparticles has type compatibility issues with React 19 */}
      <Particles
        id="tsparticles"
        init={async (engine: Engine) => {
          await loadSlim(engine);
        }}
        options={options}
      />
    </div>
  );
}

