import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Video,
	OffthreadVideo,
} from 'remotion';

export const ACCENT = '#00e5ff';
export const ACCENT2 = '#ff2d95';
export const GOLD = '#ffd23f';

const SceneCtx = React.createContext(0);

export const Scene: React.FC<{
	from: number;
	durationInFrames: number;
	children?: React.ReactNode;
}> = ({ from, durationInFrames, children }) => {
	return (
		<SceneCtx.Provider value={from}>
			<Sequence from={from} durationInFrames={durationInFrames}>
				{children}
			</Sequence>
		</SceneCtx.Provider>
	);
};

export const Shot: React.FC<{
	src: string;
	from: number;
	duration: number;
	kenBurns?: 'in' | 'out' | 'left' | 'right';
	children?: React.ReactNode;
	overlay?: boolean;
}> = ({ src, from, duration, kenBurns = 'in', children, overlay = true }) => {
	const sceneFrom = React.useContext(SceneCtx);
	const frame = useCurrentFrame() + sceneFrom;
	const local = frame - from;
	const p = Math.max(0, Math.min(1, local / duration));

	let scale = 1.1;
	let tx = 0;
	if (kenBurns === 'in') scale = 1.0 + p * 0.18;
	if (kenBurns === 'out') scale = 1.18 - p * 0.16;
	if (kenBurns === 'left') {
		scale = 1.12;
		tx = (p - 0.5) * 80;
	}
	if (kenBurns === 'right') {
		scale = 1.12;
		tx = (0.5 - p) * 80;
	}

	const fadeIn = interpolate(local, [0, 8], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(local, [duration - 8, duration], [1, 0.55], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = Math.min(fadeIn, fadeOut);

	return (
		<AbsoluteFill style={{ backgroundColor: '#000' }}>
			<AbsoluteFill
				style={{
					transform: `scale(${scale}) translateX(${tx}px)`,
					opacity,
				}}
			>
				<Img
					src={staticFile(src)}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</AbsoluteFill>
			{overlay && (
				<AbsoluteFill
					style={{
						background:
							'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 100%)',
					}}
				/>
			)}
			{children}
		</AbsoluteFill>
	);
};

export const VideoShot: React.FC<{
	src: string;
	from: number;
	duration: number;
	startFrom?: number;
	children?: React.ReactNode;
	overlay?: boolean;
	muted?: boolean;
	playbackRate?: number;
}> = ({ src, from, duration, startFrom = 0, children, overlay = true, muted = true, playbackRate = 1 }) => {
	const sceneFrom = React.useContext(SceneCtx);
	const frame = useCurrentFrame() + sceneFrom;
	const local = frame - from;
	const { fps } = useVideoConfig();
	const p = Math.max(0, Math.min(1, local / duration));

	const fadeIn = interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
	const fadeOut = interpolate(local, [duration - 8, duration], [1, 0.55], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = Math.min(fadeIn, fadeOut);

	return (
		<AbsoluteFill style={{ backgroundColor: '#000' }}>
			<AbsoluteFill style={{ opacity }}>
				<OffthreadVideo
					src={staticFile(src)}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					muted={muted}
					playbackRate={playbackRate}
				/>
			</AbsoluteFill>
			{overlay && (
				<AbsoluteFill
					style={{
						background:
							'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 100%)',
					}}
				/>
			)}
			{children}
		</AbsoluteFill>
	);
};

export const BigText: React.FC<{
	text: string;
	from: number;
	sub?: string;
	color?: string;
	anim?: 'spring' | 'slideUp' | 'fadeScale' | 'typewriter' | 'colorPop' | 'highlight';
}> = ({ text, from, sub, color = '#fff', anim = 'spring' }) => {
	const sceneFrom = React.useContext(SceneCtx);
	const frame = useCurrentFrame() + sceneFrom;
	const { fps } = useVideoConfig();
	const local = frame - from;
	
	const s = spring({ frame: local, fps, config: { damping: 14, stiffness: 120 } });
	
	let op = 0;
	let tx = 0;
	let ty = 0;
	let scaleAnim = 1;
	
	if (anim === 'spring') {
		op = interpolate(local, [0, 8, 20, 26], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
		scaleAnim = s;
	} else if (anim === 'slideUp') {
		op = interpolate(local, [0, 10, 20, 30], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
		ty = interpolate(local, [0, 15], [60, 0], { extrapolateRight: 'clamp' });
	} else if (anim === 'fadeScale') {
		op = interpolate(local, [0, 8, 20, 26], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
		scaleAnim = interpolate(local, [0, 10], [0.6, 1], { extrapolateRight: 'clamp' });
	} else if (anim === 'typewriter') {
		op = interpolate(local, [0, 8, 20, 26], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
	} else if (anim === 'colorPop') {
		op = interpolate(local, [0, 6, 18, 24], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
		scaleAnim = interpolate(local, [0, 6, 12], [0.8, 1.15, 1], { extrapolateRight: 'clamp' });
	} else if (anim === 'highlight') {
		op = interpolate(local, [0, 8, 20, 26], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
	}

	const colorAnim = anim === 'colorPop' 
		? interpolate(local, [0, 6, 12, 18], [color, ACCENT, color, ACCENT], { extrapolateRight: 'clamp' })
		: color;

	return (
		<AbsoluteFill
			style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}
		>
			<div style={{ transform: `translate(${tx}px, ${ty}px) scale(${scaleAnim})`, opacity: op, textAlign: 'center' }}>
				<div
					style={{
						color: colorAnim,
						fontSize: 104,
						fontWeight: 900,
						fontFamily: 'Arial, sans-serif',
						lineHeight: 1.02,
						textShadow: `0 0 30px ${color}66, 0 6px 24px rgba(0,0,0,0.9)`,
						letterSpacing: -2,
						whiteSpace: 'pre-line',
					}}
				>
					{text}
				</div>
				{sub && (
					<div
						style={{
							color: ACCENT,
							fontSize: 44,
							fontWeight: 700,
							fontFamily: 'Arial, sans-serif',
							marginTop: 18,
							letterSpacing: 4,
							textTransform: 'uppercase',
							opacity: op,
						}}
					>
						{sub}
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};

export const LowerThird: React.FC<{
	text: string;
	from: number;
	color?: string;
	anim?: 'slideLeft' | 'fadeUp' | 'scaleIn' | 'typewriter';
}> = ({ text, from, color = ACCENT, anim = 'slideLeft' }) => {
	const sceneFrom = React.useContext(SceneCtx);
	const frame = useCurrentFrame() + sceneFrom;
	const { fps } = useVideoConfig();
	const local = frame - from;
	
	const s = spring({ frame: local, fps, config: { damping: 18 } });
	
	let x = 0;
	let op = 0;
	
	if (anim === 'slideLeft') {
		x = interpolate(s, [0, 1], [-120, 0]);
		op = interpolate(local, [0, 8, 90, 100], [0, 1, 1, 0], {
			extrapolateRight: 'clamp',
			extrapolateLeft: 'clamp',
		});
	} else if (anim === 'fadeUp') {
		op = interpolate(local, [0, 8, 90, 100], [0, 1, 1, 0], {
			extrapolateRight: 'clamp',
			extrapolateLeft: 'clamp',
		});
	} else if (anim === 'scaleIn') {
		op = interpolate(local, [0, 8, 90, 100], [0, 1, 1, 0], {
			extrapolateRight: 'clamp',
			extrapolateLeft: 'clamp',
		});
	} else if (anim === 'typewriter') {
		op = interpolate(local, [0, 8, 90, 100], [0, 1, 1, 0], {
			extrapolateRight: 'clamp',
			extrapolateLeft: 'clamp',
		});
	}

	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				bottom: 340,
				transform: `translateX(${x}px)`,
				opacity: op,
				display: 'flex',
				alignItems: 'center',
				gap: 22,
			}}
		>
			<div
				style={{
					width: 12,
					height: 64,
					backgroundColor: color,
					borderRadius: 6,
					boxShadow: `0 0 18px ${color}`,
				}}
			/>
			<div
				style={{
					color: '#fff',
					fontSize: 46,
					fontWeight: 800,
					fontFamily: 'Arial, sans-serif',
					textShadow: '0 3px 14px rgba(0,0,0,0.9)',
				}}
			>
				{text}
			</div>
		</div>
	);
};

export const Brand: React.FC = () => {
	const frame = useCurrentFrame();
	const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
	return (
		<div
			style={{
				position: 'absolute',
				top: 70,
				left: 70,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				opacity: op,
			}}
		>
			<div
				style={{
					width: 18,
					height: 18,
					backgroundColor: ACCENT2,
					transform: 'rotate(45deg)',
					boxShadow: `0 0 18px ${ACCENT2}`,
				}}
			/>
			<div
				style={{
					color: '#fff',
					fontSize: 40,
					fontWeight: 900,
					fontFamily: 'Arial, sans-serif',
					letterSpacing: 6,
				}}
			>
				VOID<span style={{ color: ACCENT }}>ID</span>
			</div>
		</div>
	);
};

export const Subscribe: React.FC<{ durationInFrames: number }> = ({
	durationInFrames,
}) => {
	const sceneFrom = React.useContext(SceneCtx);
	const frame = useCurrentFrame() + sceneFrom;
	const { fps } = useVideoConfig();
	const local = frame - (durationInFrames - 3 * 60);
	const s = spring({ frame: local, fps, config: { damping: 12 } });
	const pulse = 1 + Math.sin(frame / 8) * 0.03;
	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				background: 'rgba(0,0,0,0.55)',
				opacity: Math.min(1, Math.max(0, local / 12)),
			}}
		>
			<div style={{ transform: `scale(${s * pulse})`, textAlign: 'center' }}>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 22,
						backgroundColor: ACCENT2,
						padding: '26px 52px',
						borderRadius: 999,
						boxShadow: `0 0 60px ${ACCENT2}`,
					}}
				>
					<svg width="46" height="46" viewBox="0 0 24 24" fill="#fff">
						<path d="M8 5v14l11-7z" />
					</svg>
					<span
						style={{
							color: '#fff',
							fontSize: 58,
							fontWeight: 900,
							fontFamily: 'Arial, sans-serif',
						}}
					>
						SUBSCRIBE
					</span>
				</div>
				<div
					style={{
						color: GOLD,
						fontSize: 40,
						fontWeight: 800,
						fontFamily: 'Arial, sans-serif',
						marginTop: 26,
						letterSpacing: 2,
					}}
				>
					@voididgaming
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Progress: React.FC<{ durationInFrames: number }> = ({
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	const p = frame / durationInFrames;
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				height: 8,
				width: `${p * 100}%`,
				backgroundColor: ACCENT,
				boxShadow: `0 0 16px ${ACCENT}`,
			}}
		/>
	);
};