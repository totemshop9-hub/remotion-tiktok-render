import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = '"DejaVu Sans","Noto Sans",Arial,Helvetica,sans-serif';

export type AnimStyle = 'slideUp' | 'scalePop' | 'slideLeft' | 'typewriter' | 'colorPop';
export type Move = 'zoomIn' | 'zoomOut' | 'panLR' | 'panRL' | 'rotate';

export interface Scene {
  kind: 'photo' | 'video';
  src: string;
  move: Move;
  headline: string;
  sub: string;
  anim: AnimStyle;
  fromSec?: number;
}

export interface ProductConfig {
  id: string;
  productName: string;
  price: string;
  audio: string;
  narrationFrames: number;
  accentA: string;
  accentB: string;
  scenes: Scene[];
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

const kbTransform = (move: Move, p: number) => {
  switch (move) {
    case 'zoomIn':
      return {scale: 1.0 + 0.2 * p, tx: 0, ty: 0, rot: 0};
    case 'zoomOut':
      return {scale: 1.2 - 0.2 * p, tx: 0, ty: 0, rot: 0};
    case 'panLR':
      return {scale: 1.16, tx: -0.06 + 0.12 * p, ty: 0, rot: 0};
    case 'panRL':
      return {scale: 1.16, tx: 0.06 - 0.12 * p, ty: 0, rot: 0};
    case 'rotate':
      return {scale: 1.14, tx: 0, ty: 0, rot: -2.2 + 4.4 * p};
    default:
      return {scale: 1.1, tx: 0, ty: 0, rot: 0};
  }
};

const Background: React.FC<{a: string; b: string}> = ({a, b}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 60;
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${a} 0%, #05060f 72%)`}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${540 + drift}px ${420}px, ${b}66 0%, transparent 45%), radial-gradient(circle at ${300 - drift}px ${1500}px, ${b}44 0%, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const resolveSrc = (src: string) => (src.startsWith('http') || src.startsWith('/') ? src : staticFile(src));

const PhotoLayer: React.FC<{src: string; move: Move; dur: number}> = ({src, move, dur}) => {
  const frame = useCurrentFrame();
  const p = clamp(frame / Math.max(1, dur - 1));
  const t = kbTransform(move, p);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={resolveSrc(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${t.tx * 100}%, ${t.ty * 100}%) scale(${t.scale}) rotate(${t.rot}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

const sceneFromSec = (scene?: {fromSec?: number}) => Math.max(0, Math.round((scene?.fromSec ?? 0) * 30));

const VideoLayer: React.FC<{scene: Scene; dur: number}> = ({scene, dur}) => {
  const frame = useCurrentFrame();
  const p = clamp(frame / Math.max(1, dur - 1));
  const t = kbTransform(scene.move === 'zoomOut' ? 'zoomIn' : scene.move, p);
  const vsrc = resolveSrc(scene.src);
  const startFrom = sceneFromSec(scene);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#05060f'}}>
      <AbsoluteFill style={{filter: 'blur(46px) brightness(0.4)', transform: 'scale(1.25)'}}>
        <OffthreadVideo src={vsrc} muted startFrom={startFrom} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <OffthreadVideo
          src={vsrc}
          muted
          startFrom={startFrom}
          style={{
            width: 1080,
            transform: `scale(${1.0 + 0.06 * p}) rotate(${t.rot}deg)`,
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Headline: React.FC<{scene: Scene; accentB: string}> = ({scene, accentB}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {headline, sub, anim} = scene;

  let hStyle: React.CSSProperties = {};
  let sStyle: React.CSSProperties = {};
  let cursor = '';

  if (anim === 'slideUp') {
    const y = interpolate(frame, [0, 12], [70, 0], {extrapolateRight: 'clamp'});
    const o = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
    hStyle = {transform: `translateY(${y}px)`, opacity: o};
    sStyle = {opacity: interpolate(frame, [6, 14], [0, 1], {extrapolateRight: 'clamp'})};
  } else if (anim === 'scalePop') {
    const s = spring({frame, fps, config: {damping: 11, mass: 0.6, stiffness: 120}});
    hStyle = {transform: `scale(${0.5 + 0.5 * s})`, opacity: clamp(s * 1.4)};
    sStyle = {opacity: interpolate(frame, [8, 16], [0, 1], {extrapolateRight: 'clamp'})};
  } else if (anim === 'slideLeft') {
    const x = interpolate(frame, [0, 12], [-160, 0], {extrapolateRight: 'clamp'});
    hStyle = {transform: `translateX(${x}px)`, opacity: interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'})};
    sStyle = {opacity: interpolate(frame, [6, 14], [0, 1], {extrapolateRight: 'clamp'})};
  } else if (anim === 'typewriter') {
    const n = Math.floor(interpolate(frame, [0, 26], [0, headline.length], {extrapolateRight: 'clamp'}));
    cursor = Math.floor(frame / 7) % 2 === 0 ? '_' : ' ';
    hStyle = {};
    sStyle = {opacity: interpolate(frame, [16, 24], [0, 1], {extrapolateRight: 'clamp'})};
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{...hStyle, fontFamily: FONT, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: '#fff'}} >
          {headline.slice(0, n)}
          <span style={{color: accentB}}>{cursor}</span>
        </div>
        <div style={{...sStyle, marginTop: 18, fontFamily: FONT, fontSize: 44, color: '#e5e7eb'}}>{sub}</div>
      </div>
    );
  } else {
    // colorPop
    const s = spring({frame, fps, config: {damping: 9, mass: 0.7, stiffness: 110}});
    hStyle = {transform: `scale(${0.7 + 0.3 * s})`, opacity: clamp(s * 1.5)};
    sStyle = {opacity: interpolate(frame, [8, 16], [0, 1], {extrapolateRight: 'clamp'})};
  }

  return (
    <div style={{textAlign: 'center'}}>
      <div
        style={{
          ...hStyle,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.05,
          color: '#fff',
          textShadow: `0 6px 30px ${accentB}88`,
        }}
      >
        {headline}
      </div>
      <div style={{...sStyle, marginTop: 18, fontFamily: FONT, fontSize: 44, color: '#e5e7eb'}}>{sub}</div>
    </div>
  );
};

const SceneView: React.FC<{scene: Scene; dur: number; accentA: string; accentB: string}> = ({
  scene,
  dur,
  accentA,
  accentB,
}) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 7], [0.85, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      {scene.kind === 'photo' ? (
        <PhotoLayer src={scene.src} move={scene.move} dur={dur} />
      ) : (
        <VideoLayer scene={scene} dur={dur} />
      )}
      {/* readability gradient at bottom */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 32%, transparent 55%)',
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 300}}>
        <div
          style={{
            width: 920,
            padding: '34px 40px',
            borderRadius: 34,
            background: 'rgba(10,12,22,0.42)',
            backdropFilter: 'blur(6px)',
            border: `2px solid ${accentB}55`,
          }}
        >
          <Headline scene={scene} accentB={accentB} />
        </div>
      </AbsoluteFill>
      {/* transition flash */}
      <AbsoluteFill style={{background: accentB, opacity: flash}} />
    </AbsoluteFill>
  );
};

const TopBadge: React.FC<{name: string; price: string; accentB: string}> = ({name, price, accentB}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{paddingTop: 84, paddingLeft: 48, paddingRight: 48, opacity: o}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 40,
            color: '#fff',
            background: `${accentB}22`,
            border: `2px solid ${accentB}`,
            padding: '12px 26px',
            borderRadius: 999,
            maxWidth: 620,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 40,
            color: '#0b0d16',
            background: accentB,
            padding: '12px 26px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          {price}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{accentB: string}> = ({accentB}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = clamp(frame / durationInFrames);
  return (
    <AbsoluteFill style={{top: 0, left: 0, right: 0, height: 10}}>
      <div style={{width: `${p * 100}%`, height: '100%', background: accentB}} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{config: ProductConfig}> = ({config}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, mass: 0.8, stiffness: 100}});
  const zoom = 1.05 + 0.05 * clamp(frame / 80);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Img src={config.scenes.find((x) => x.kind === 'photo')!.src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(5,6,15,0.95) 8%, rgba(5,6,15,0.55) 45%, rgba(5,6,15,0.25) 100%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
        <div style={{textAlign: 'center', transform: `scale(${0.7 + 0.3 * s})`, opacity: clamp(s * 1.4)}}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: '#fff', letterSpacing: 2}}>CHECKOUT SEKARANG</div>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 96,
              color: '#0b0d16',
              background: config.accentB,
              padding: '22px 60px',
              borderRadius: 28,
              display: 'inline-block',
              boxShadow: `0 20px 60px ${config.accentB}77`,
            }}
          >
            KERANJANG KUNING
          </div>
          <div style={{marginTop: 30, fontFamily: FONT, fontSize: 46, color: '#e5e7eb'}}>
            {config.productName} · {config.price}
          </div>
          <div style={{marginTop: 12, fontFamily: FONT, fontSize: 34, color: config.accentB, fontWeight: 700}}>
            cek keranjang kuning sekarang
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ProductVideo: React.FC<{config: ProductConfig}> = ({config}) => {
  const {durationInFrames} = useVideoConfig();
  const narr = config.narrationFrames;
  const n = config.scenes.length;
  const bounds = config.scenes.map((_, i) => ({
    from: Math.round((i * narr) / n),
    to: Math.round(((i + 1) * narr) / n),
  }));

  return (
    <AbsoluteFill style={{background: '#05060f'}}>
      <Background a={config.accentA} b={config.accentB} />
      {config.scenes.map((scene, i) => (
        <Sequence key={i} from={bounds[i].from} durationInFrames={bounds[i].to - bounds[i].from}>
          <SceneView scene={scene} dur={bounds[i].to - bounds[i].from} accentA={config.accentA} accentB={config.accentB} />
        </Sequence>
      ))}
      <Sequence from={narr} durationInFrames={Math.max(1, durationInFrames - narr)}>
        <EndCard config={config} />
      </Sequence>
      <TopBadge name={config.productName} price={config.price} accentB={config.accentB} />
      <Progress accentB={config.accentB} />
      <Audio src={staticFile(config.audio)} />
    </AbsoluteFill>
  );
};