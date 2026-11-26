import React from 'react';
import {Composition} from 'remotion';
import {ProductVideo, ProductConfig} from './ProductVideo';

const COMMON = {fps: 30, width: 1080, height: 1920};

const tumbler: ProductConfig = {
  id: '01-tumbler',
  productName: 'Tumbler Stainless',
  price: 'Rp75rb',
  audio: 'audio/narration_01.mp3',
  narrationFrames: 265,
  accentA: '#1e3a8a',
  accentB: '#06b6d4',
  scenes: [
    {kind: 'photo', src: 'products/tumbler.jpg', move: 'zoomIn', headline: 'Tumbler murahan bikin minuman hangat', sub: 'padahal baru beli', anim: 'slideUp'},
    {kind: 'photo', src: 'products/tumbler.jpg', move: 'panLR', headline: 'Stainless viral tahan dingin 12 jam', sub: 'anti bocor, dibalik pun aman', anim: 'scalePop'},
    {kind: 'photo', src: 'products/tumbler.jpg', move: 'zoomOut', headline: 'Muat cup holder mobil', sub: 'praktis dibawa ke mana aja', anim: 'slideLeft'},
    {kind: 'photo', src: 'products/tumbler.jpg', move: 'panRL', headline: 'Rp75rb di TikTok Shop', sub: 'cek keranjang kuning', anim: 'colorPop'},
  ],
};

const knee: ProductConfig = {
  id: '02-knee-support',
  productName: 'Pelindung Lutut',
  price: 'Rp61.275',
  audio: 'audio/narration_02.mp3',
  narrationFrames: 351,
  accentA: '#7c2d12',
  accentB: '#f97316',
  scenes: [
    {kind: 'photo', src: 'products/knee.jpg', move: 'zoomIn', headline: 'Lutut bunyi krek krek pas naik tangga', sub: 'relate banget', anim: 'slideUp'},
    {kind: 'photo', src: 'products/knee.jpg', move: 'panLR', headline: 'Pelindung lutut elastis breathable', sub: 'tidak melorot', anim: 'scalePop'},
    {kind: 'photo', src: 'products/knee.jpg', move: 'zoomOut', headline: 'Buat lari, gym, badminton', sub: 'nyaman dipakai', anim: 'slideLeft'},
    {kind: 'photo', src: 'products/knee.jpg', move: 'panRL', headline: 'Rp61.275 di TikTok Shop', sub: 'cek keranjang kuning', anim: 'typewriter'},
  ],
};

const aurora: ProductConfig = {
  id: '03-lampu-aurora',
  productName: 'Lampu Aurora',
  price: 'Rp75.539',
  audio: 'audio/narration_03.mp3',
  narrationFrames: 297,
  accentA: '#4c1d95',
  accentB: '#a855f7',
  scenes: [
    {kind: 'video', src: 'video/aurora_clip1.mp4', move: 'zoomIn', headline: 'Susah tidur kamar gelap banget', sub: 'ngakak', anim: 'slideUp'},
    {kind: 'photo', src: 'products/aurora.jpg', move: 'panLR', headline: 'Lampu proyektor aurora', sub: 'kamar jadi langit berbintang', anim: 'scalePop'},
    {kind: 'video', src: 'video/aurora_clip2.mp4', move: 'rotate', headline: 'Menenangkan buat tidur', sub: 'bagus buat kamar anak', anim: 'slideLeft'},
    {kind: 'photo', src: 'products/aurora.jpg', move: 'zoomOut', headline: 'Rp75.539 di TikTok Shop', sub: 'cek keranjang kuning', anim: 'colorPop'},
  ],
};

const resistanceBand: ProductConfig = {
  id: '04-resistance-band',
  productName: 'Resistance Band Set',
  price: 'Rp30-80rb',
  audio: 'audio/narration_04_v3.mp3',
  narrationFrames: 674,
  accentA: '#14532d',
  accentB: '#84cc16',
  scenes: [
    {kind: 'photo', src: 'products/resistance_band.jpg', move: 'zoomIn', headline: 'Pengen kurus tapi males ke gym?', sub: 'ada solusinya di rumah', anim: 'slideUp'},
    {kind: 'photo', src: 'products/resistance_band.jpg', move: 'panLR', headline: 'Resistance Band Set 5 Level', sub: 'dari pemula sampai pro', anim: 'scalePop'},
    {kind: 'photo', src: 'products/resistance_band.jpg', move: 'rotate', headline: 'Workout full body di rumah', sub: 'portable, tanpa gym', anim: 'slideLeft'},
    {kind: 'photo', src: 'products/resistance_band.jpg', move: 'zoomOut', headline: 'Rp30-80rb di TikTok Shop', sub: 'cek keranjang kuning', anim: 'colorPop'},
  ],
};

const dempulAjaib: ProductConfig = {
  id: '05-dempul-ajaib',
  productName: 'Dempul Ajaib',
  price: 'Rp10.601',
  audio: 'audio/narration_05.mp3',
  narrationFrames: 280,
  accentA: '#78350f',
  accentB: '#fbbf24',
  scenes: [
    {kind: 'photo', src: 'products/dempul_ajaib.jpg', move: 'zoomIn', headline: 'Tembok bolong bikin males', sub: 'tenang, ada dempul ajaib', anim: 'slideUp'},
    {kind: 'photo', src: 'products/dempul_ajaib.jpg', move: 'panLR', headline: 'Tutup lubang dalam detik', sub: 'tanpa alat ribet', anim: 'scalePop'},
    {kind: 'photo', src: 'products/dempul_ajaib.jpg', move: 'zoomOut', headline: 'Rapi, cepat, murah', sub: 'cuma Rp10.601', anim: 'slideLeft'},
    {kind: 'photo', src: 'products/dempul_ajaib.jpg', move: 'panRL', headline: 'Cek keranjang kuning', sub: 'sebelum kehabisan', anim: 'colorPop'},
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id={tumbler.id} component={ProductVideo} {...COMMON} durationInFrames={340} defaultProps={{config: tumbler}} />
      <Composition id={knee.id} component={ProductVideo} {...COMMON} durationInFrames={426} defaultProps={{config: knee}} />
      <Composition id={aurora.id} component={ProductVideo} {...COMMON} durationInFrames={372} defaultProps={{config: aurora}} />
      <Composition id={resistanceBand.id} component={ProductVideo} {...COMMON} durationInFrames={749} defaultProps={{config: resistanceBand}} />
      <Composition id={dempulAjaib.id} component={ProductVideo} {...COMMON} durationInFrames={355} defaultProps={{config: dempulAjaib}} />
    </>
  );
};