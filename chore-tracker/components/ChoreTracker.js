'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { storage } from '../lib/storage';

// Chore catalog from the earnings chart
const CHORES = [
  { id: 'dog_poop', name: 'Dog Poop (Saturday)', rate: 1.00 },
  { id: 'toilet', name: 'Toilet Cleaned', rate: 1.00, note: '1x per week' },
  { id: 'weeds', name: 'Weeds Pulled', rate: 2.00, note: '1x per week' },
  { id: 'lawn', name: 'Lawn Mowed', rate: 1.00, note: '2x per week' },
  { id: 'brush_avery', name: 'Brush Avery Outside', rate: 0.25 },
  { id: 'vac_kitchen', name: 'Vacuum Kitchen & Living', rate: 1.00 },
  { id: 'vac_upstairs', name: 'Vacuum Upstairs', rate: 0.25 },
  { id: 'vac_bedroom', name: 'Vacuum Bedroom', rate: 0.25 },
  { id: 'vac_stairs', name: 'Vacuum Stairs', rate: 1.00 },
  { id: 'laundry_full', name: 'Wash, Fold, Put Away Laundry', rate: 2.00 },
  { id: 'laundry_put', name: 'Put Away Laundry', rate: 0.25 },
  { id: 'tp_restock', name: 'Toilet Paper Restock', rate: 0.25 },
  { id: 'sanitizer', name: 'Sanitizer Restock', rate: 0.25 },
  { id: 'empty_dw', name: 'Empty Dishwasher', rate: 0.25 },
  { id: 'load_dw', name: 'Load Dishwasher', rate: 0.25 },
  { id: 'stair_basket', name: 'Empty Stair Basket', rate: 0.50, note: '2x per week' },
  { id: 'dust_rails', name: 'Dust Stair Railings', rate: 1.00, note: '1x per week' },
  { id: 'walk_avery', name: 'Walk Avery (10 min)', rate: 0.50 },
  { id: 'play_avery', name: 'Play with Avery (10 min)', rate: 0.50 },
  { id: 'windex_door', name: 'Back Door Windex', rate: 0.25, note: '1x per week' },
  { id: 'mirrors', name: 'All Mirrors', rate: 1.00, note: '1x per week' },
  { id: 'bath_trash', name: 'All Bathroom Trash', rate: 0.50 },
  { id: 'bath_sinks', name: 'Bathroom Counters & Sinks', rate: 0.50 },
  { id: 'bedding_off', name: 'Take Off Bedding', rate: 1.00, note: '1x per month' },
  { id: 'bedding_on', name: 'Bedding Back On', rate: 1.00, note: '1x per month' },
  { id: 'art_cabinet', name: 'Organize Art Cabinet', rate: 0.50 },
  { id: 'mop_kitchen', name: 'Mop Kitchen & Living', rate: 1.00 },
  { id: 'mop_entry', name: 'Mop Entry Hallway', rate: 0.50 },
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const STREAKS = [
  { id: 'piano_hw', name: 'Piano & homework right after school', rate: 0.25, payType: 'per_check', days: [1, 2, 3, 4, 5] },
  { id: 'beds_rooms', name: 'Beds made & rooms clean at 7:30 PM', rate: 0.25, payType: 'per_check', days: [0, 1, 2, 3, 4] },
  { id: 'backpacks', name: 'Backpacks, shoes, lunchbox, jackets', rate: 1.00, payType: 'full_streak', days: [1, 2, 3, 4, 5] },
  { id: 'kindness', name: 'Kindness counts (no timeouts)', rate: 1.00, payType: 'full_streak', days: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'bedtime', name: 'In bed at 8:00 PM', rate: 1.00, payType: 'full_streak', days: [0, 1, 2, 3, 4] },
];

// EDIT THESE: replace with your kids' actual names
const KIDS = ['Kid 1', 'Kid 2', 'Kid 3'];

// ---------- Hand-drawn SVG icons ----------
const stroke = { stroke: '#1a1a1a', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

const KidFace = ({ size = 36, hair = 'short' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="22" r="13" {...stroke} fill="#fff" />
    {hair === 'short' && (
      <path d="M9 17 Q12 9 20 9 Q28 9 31 17" {...stroke} fill="#FFD43A" />
    )}
    {hair === 'curly' && (
      <>
        <circle cx="12" cy="13" r="3" {...stroke} fill="#FFD43A" />
        <circle cx="20" cy="10" r="3.5" {...stroke} fill="#FFD43A" />
        <circle cx="28" cy="13" r="3" {...stroke} fill="#FFD43A" />
      </>
    )}
    {hair === 'pigtails' && (
      <>
        <path d="M10 16 Q10 8 18 9" {...stroke} fill="#FFD43A" />
        <path d="M30 16 Q30 8 22 9" {...stroke} fill="#FFD43A" />
        <circle cx="8" cy="20" r="2.5" {...stroke} fill="#FFD43A" />
        <circle cx="32" cy="20" r="2.5" {...stroke} fill="#FFD43A" />
      </>
    )}
    <circle cx="16" cy="22" r="1" fill="#1a1a1a" />
    <circle cx="24" cy="22" r="1" fill="#1a1a1a" />
    <path d="M16 27 Q20 30 24 27" {...stroke} />
  </svg>
);

const Sun = ({ size = 80, opacity = 0.18 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ opacity }}>
    <circle cx="40" cy="40" r="14" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    {[...Array(8)].map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 40 + Math.cos(angle) * 20;
      const y1 = 40 + Math.sin(angle) * 20;
      const x2 = 40 + Math.cos(angle) * 30;
      const y2 = 40 + Math.sin(angle) * 30;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />;
    })}
  </svg>
);

const CoinIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" {...stroke} fill="#FFD43A" />
    <text x="12" y="16" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="13" fill="#1a1a1a">$</text>
  </svg>
);

// ---------- Hand-drawn chore/streak icons ----------
// All icons 40x40 viewBox, designed to feel hand-drawn with chunky strokes
const Icons = {
  dogPoop: (
    <svg viewBox="0 0 40 40">
      <path d="M10 30 Q8 26 12 24 Q10 19 15 18 Q16 13 21 14 Q24 10 28 14 Q33 14 32 19 Q35 22 32 26 Q34 30 28 30 Z" {...stroke} fill="#fff" />
      <path d="M14 24 Q17 22 19 24" {...stroke} />
      <path d="M22 21 Q25 19 27 22" {...stroke} />
    </svg>
  ),
  toilet: (
    <svg viewBox="0 0 40 40">
      <ellipse cx="20" cy="22" rx="10" ry="6" {...stroke} fill="#fff" />
      <path d="M12 22 L13 30 Q13 33 16 33 L24 33 Q27 33 27 30 L28 22" {...stroke} fill="#fff" />
      <rect x="13" y="8" width="14" height="10" rx="2" {...stroke} fill="#fff" />
      <path d="M16 13 L24 13" {...stroke} />
    </svg>
  ),
  weeds: (
    <svg viewBox="0 0 40 40">
      <path d="M12 32 Q14 22 18 14" {...stroke} />
      <path d="M14 22 Q10 20 9 16" {...stroke} />
      <path d="M16 17 Q12 14 12 10" {...stroke} />
      <path d="M22 32 Q24 22 28 14" {...stroke} />
      <path d="M24 22 Q28 20 30 16" {...stroke} />
      <path d="M26 17 Q30 14 31 10" {...stroke} />
      <path d="M6 34 L34 34" {...stroke} />
      <path d="M8 32 L4 28 L12 30" {...stroke} fill="#FFD43A" />
    </svg>
  ),
  lawn: (
    <svg viewBox="0 0 40 40">
      <path d="M5 30 L9 22 L13 30 L17 22 L21 30 L25 22 L29 30 L33 22 L35 30" {...stroke} fill="#FFD43A" />
      <path d="M4 32 L36 32" {...stroke} />
      <circle cx="20" cy="14" r="3" {...stroke} fill="#fff" />
      <path d="M20 11 L20 6" {...stroke} />
    </svg>
  ),
  dog: (
    <svg viewBox="0 0 40 40">
      <ellipse cx="20" cy="24" rx="11" ry="9" {...stroke} fill="#fff" />
      <path d="M11 18 L8 12 L14 16" {...stroke} fill="#fff" />
      <path d="M29 18 L32 12 L26 16" {...stroke} fill="#fff" />
      <circle cx="17" cy="23" r="1.2" fill="#1a1a1a" />
      <circle cx="23" cy="23" r="1.2" fill="#1a1a1a" />
      <ellipse cx="20" cy="28" rx="2" ry="1.5" {...stroke} fill="#1a1a1a" />
      <path d="M18 30 Q20 32 22 30" {...stroke} />
    </svg>
  ),
  vacuum: (
    <svg viewBox="0 0 40 40">
      <rect x="8" y="22" width="18" height="10" rx="2" {...stroke} fill="#FFD43A" />
      <circle cx="12" cy="32" r="2.5" {...stroke} fill="#fff" />
      <circle cx="22" cy="32" r="2.5" {...stroke} fill="#fff" />
      <path d="M26 24 Q32 20 32 12" {...stroke} />
      <circle cx="32" cy="10" r="2.5" {...stroke} fill="#fff" />
      <path d="M12 22 L12 18" {...stroke} />
    </svg>
  ),
  upstairs: (
    <svg viewBox="0 0 40 40">
      <path d="M6 32 L14 32 L14 26 L22 26 L22 20 L30 20 L30 14 L36 14" {...stroke} fill="#fff" />
      <path d="M28 10 L30 6 L32 10" {...stroke} />
      <path d="M30 6 L30 14" {...stroke} />
    </svg>
  ),
  bedroom: (
    <svg viewBox="0 0 40 40">
      <rect x="6" y="20" width="28" height="10" rx="1" {...stroke} fill="#fff" />
      <path d="M8 22 L8 18 Q8 16 10 16 L16 16 Q18 16 18 18 L18 22" {...stroke} fill="#FFD43A" />
      <path d="M6 30 L6 34" {...stroke} />
      <path d="M34 30 L34 34" {...stroke} />
      <circle cx="13" cy="19" r="1.5" fill="#1a1a1a" />
    </svg>
  ),
  stairs: (
    <svg viewBox="0 0 40 40">
      <path d="M6 32 L14 32 L14 26 L22 26 L22 20 L30 20 L30 14 L36 14 L36 32 Z" {...stroke} fill="#fff" />
      <path d="M14 26 L22 20" {...stroke} strokeDasharray="2 2" />
    </svg>
  ),
  laundryFull: (
    <svg viewBox="0 0 40 40">
      <rect x="7" y="8" width="26" height="26" rx="3" {...stroke} fill="#fff" />
      <circle cx="20" cy="22" r="8" {...stroke} fill="#FFD43A" />
      <circle cx="20" cy="22" r="4" {...stroke} fill="#fff" />
      <circle cx="12" cy="13" r="1.2" fill="#1a1a1a" />
      <circle cx="16" cy="13" r="1.2" fill="#1a1a1a" />
      <path d="M22 19 Q20 22 22 25" {...stroke} />
    </svg>
  ),
  laundryPut: (
    <svg viewBox="0 0 40 40">
      <path d="M10 14 L20 8 L30 14 L30 16 L24 18 L24 30 L16 30 L16 18 L10 16 Z" {...stroke} fill="#fff" />
      <path d="M14 24 Q20 22 26 24" {...stroke} />
    </svg>
  ),
  toiletPaper: (
    <svg viewBox="0 0 40 40">
      <ellipse cx="20" cy="14" rx="11" ry="4" {...stroke} fill="#fff" />
      <path d="M9 14 L9 26 Q9 30 20 30 Q31 30 31 26 L31 14" {...stroke} fill="#fff" />
      <ellipse cx="20" cy="14" rx="4" ry="1.5" {...stroke} fill="#FFD43A" />
      <path d="M22 26 Q26 32 22 36" {...stroke} />
    </svg>
  ),
  sanitizer: (
    <svg viewBox="0 0 40 40">
      <rect x="13" y="14" width="14" height="18" rx="2" {...stroke} fill="#fff" />
      <rect x="15" y="8" width="10" height="6" rx="1" {...stroke} fill="#FFD43A" />
      <path d="M17 22 L23 22" {...stroke} />
      <path d="M17 26 L23 26" {...stroke} />
      <path d="M20 6 L20 4" {...stroke} />
    </svg>
  ),
  dishwasherEmpty: (
    <svg viewBox="0 0 40 40">
      <rect x="7" y="8" width="26" height="26" rx="2" {...stroke} fill="#fff" />
      <path d="M7 16 L33 16" {...stroke} />
      <circle cx="28" cy="12" r="1.2" fill="#1a1a1a" />
      <path d="M14 22 L26 22" {...stroke} />
      <path d="M14 26 L26 26" {...stroke} />
      <path d="M22 19 L26 22 L22 25" {...stroke} />
    </svg>
  ),
  dishwasherLoad: (
    <svg viewBox="0 0 40 40">
      <rect x="7" y="8" width="26" height="26" rx="2" {...stroke} fill="#fff" />
      <path d="M7 16 L33 16" {...stroke} />
      <circle cx="28" cy="12" r="1.2" fill="#1a1a1a" />
      <circle cx="15" cy="24" r="3" {...stroke} fill="#FFD43A" />
      <rect x="20" y="22" width="6" height="6" {...stroke} fill="#FFD43A" />
    </svg>
  ),
  basket: (
    <svg viewBox="0 0 40 40">
      <path d="M8 16 L32 16 L29 32 L11 32 Z" {...stroke} fill="#FFD43A" />
      <path d="M8 16 Q20 8 32 16" {...stroke} />
      <path d="M14 18 L13 30" {...stroke} />
      <path d="M20 18 L20 30" {...stroke} />
      <path d="M26 18 L27 30" {...stroke} />
    </svg>
  ),
  duster: (
    <svg viewBox="0 0 40 40">
      <rect x="18" y="20" width="4" height="14" rx="1" {...stroke} fill="#fff" />
      <path d="M12 14 L28 14 L26 22 L14 22 Z" {...stroke} fill="#FFD43A" />
      <path d="M16 8 L16 14" {...stroke} />
      <path d="M20 6 L20 14" {...stroke} />
      <path d="M24 8 L24 14" {...stroke} />
    </svg>
  ),
  walk: (
    <svg viewBox="0 0 40 40">
      <circle cx="22" cy="10" r="3" {...stroke} fill="#fff" />
      <path d="M22 13 L20 22 L15 30" {...stroke} />
      <path d="M20 22 L26 28" {...stroke} />
      <path d="M22 16 L17 18" {...stroke} />
      <path d="M22 16 L28 14" {...stroke} />
      <path d="M6 32 Q9 30 12 32 Q14 30 16 32" {...stroke} fill="none" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="11" {...stroke} fill="#FFD43A" />
      <path d="M14 16 L18 18 L22 16 L26 18 L30 16" {...stroke} />
      <path d="M11 22 L14 24 L18 22 L22 24 L26 22 L29 24" {...stroke} />
      <path d="M14 28 L18 30 L22 28 L26 30" {...stroke} />
    </svg>
  ),
  windex: (
    <svg viewBox="0 0 40 40">
      <rect x="6" y="8" width="20" height="22" rx="1" {...stroke} fill="#fff" />
      <path d="M6 19 L26 19" {...stroke} />
      <path d="M16 8 L16 30" {...stroke} />
      <path d="M28 14 L34 18 L32 24" {...stroke} fill="#FFD43A" />
      <path d="M28 14 L30 12" {...stroke} />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 40 40">
      <ellipse cx="20" cy="18" rx="10" ry="12" {...stroke} fill="#fff" />
      <path d="M14 14 Q16 12 18 13" {...stroke} />
      <path d="M16 30 L16 36" {...stroke} />
      <path d="M24 30 L24 36" {...stroke} />
      <path d="M12 36 L28 36" {...stroke} />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 40 40">
      <path d="M10 12 L12 32 Q12 34 14 34 L26 34 Q28 34 28 32 L30 12" {...stroke} fill="#fff" />
      <path d="M7 12 L33 12" {...stroke} />
      <path d="M15 8 L25 8" {...stroke} />
      <path d="M16 18 L16 28" {...stroke} />
      <path d="M20 18 L20 28" {...stroke} />
      <path d="M24 18 L24 28" {...stroke} />
    </svg>
  ),
  sink: (
    <svg viewBox="0 0 40 40">
      <path d="M6 18 L34 18 L31 30 Q31 32 29 32 L11 32 Q9 32 9 30 Z" {...stroke} fill="#fff" />
      <circle cx="20" cy="23" r="1.5" {...stroke} fill="#1a1a1a" />
      <path d="M20 8 Q20 14 16 16" {...stroke} />
      <path d="M16 14 L14 18" {...stroke} />
    </svg>
  ),
  beddingOff: (
    <svg viewBox="0 0 40 40">
      <path d="M6 24 L34 18 L33 28 L7 32 Z" {...stroke} fill="#FFD43A" />
      <path d="M6 24 Q14 22 22 22" {...stroke} />
      <path d="M30 14 L32 10" {...stroke} />
      <path d="M28 12 L26 8" {...stroke} />
    </svg>
  ),
  beddingOn: (
    <svg viewBox="0 0 40 40">
      <rect x="6" y="22" width="28" height="10" rx="1" {...stroke} fill="#fff" />
      <path d="M8 22 L8 18 Q8 14 12 14 L16 14 Q20 14 20 18 L20 22" {...stroke} fill="#FFD43A" />
      <path d="M6 32 L6 34" {...stroke} />
      <path d="M34 32 L34 34" {...stroke} />
      <path d="M6 28 L34 28" {...stroke} />
    </svg>
  ),
  art: (
    <svg viewBox="0 0 40 40">
      <path d="M20 6 Q10 6 8 18 Q6 28 12 30 Q16 31 17 27 Q18 24 22 24 Q28 24 30 20 Q32 14 28 10 Q24 6 20 6 Z" {...stroke} fill="#FFD43A" />
      <circle cx="13" cy="14" r="1.5" fill="#1a1a1a" />
      <circle cx="18" cy="10" r="1.5" fill="#1a1a1a" />
      <circle cx="24" cy="12" r="1.5" fill="#1a1a1a" />
      <circle cx="26" cy="18" r="1.5" fill="#1a1a1a" />
    </svg>
  ),
  mop: (
    <svg viewBox="0 0 40 40">
      <rect x="19" y="6" width="2" height="20" {...stroke} fill="#fff" />
      <path d="M10 26 L30 26 L28 34 L12 34 Z" {...stroke} fill="#FFD43A" />
      <path d="M14 26 L13 34" {...stroke} />
      <path d="M18 26 L17 34" {...stroke} />
      <path d="M22 26 L23 34" {...stroke} />
      <path d="M26 26 L27 34" {...stroke} />
    </svg>
  ),
  // Streak icons
  piano: (
    <svg viewBox="0 0 40 40">
      <rect x="6" y="12" width="28" height="20" rx="2" {...stroke} fill="#fff" />
      <path d="M14 12 L14 26" {...stroke} />
      <path d="M20 12 L20 26" {...stroke} />
      <path d="M26 12 L26 26" {...stroke} />
      <rect x="12" y="12" width="4" height="8" {...stroke} fill="#1a1a1a" />
      <rect x="18" y="12" width="4" height="8" {...stroke} fill="#1a1a1a" />
      <rect x="24" y="12" width="4" height="8" {...stroke} fill="#1a1a1a" />
      <path d="M28 6 Q32 8 30 12" {...stroke} fill="#FFD43A" />
    </svg>
  ),
  bedMade: (
    <svg viewBox="0 0 40 40">
      <path d="M6 20 L20 12 L34 20" {...stroke} fill="#FFD43A" />
      <rect x="6" y="20" width="28" height="10" rx="1" {...stroke} fill="#fff" />
      <path d="M6 30 L6 34" {...stroke} />
      <path d="M34 30 L34 34" {...stroke} />
      <path d="M12 16 L12 14" {...stroke} />
      <path d="M28 16 L28 14" {...stroke} />
      <path d="M8 24 L32 24" {...stroke} />
    </svg>
  ),
  backpack: (
    <svg viewBox="0 0 40 40">
      <path d="M10 14 Q10 8 14 8 L26 8 Q30 8 30 14 L30 32 Q30 34 28 34 L12 34 Q10 34 10 32 Z" {...stroke} fill="#FFD43A" />
      <path d="M14 8 Q16 4 20 4 Q24 4 26 8" {...stroke} fill="none" />
      <rect x="14" y="20" width="12" height="8" rx="1" {...stroke} fill="#fff" />
      <circle cx="20" cy="24" r="1.2" fill="#1a1a1a" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 40 40">
      <path d="M20 32 Q8 24 8 16 Q8 10 14 10 Q18 10 20 14 Q22 10 26 10 Q32 10 32 16 Q32 24 20 32 Z" {...stroke} fill="#FFD43A" />
      <path d="M16 18 Q20 22 24 18" {...stroke} />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 40 40">
      <path d="M26 8 Q14 10 14 22 Q14 32 26 32 Q20 26 20 20 Q20 14 26 8 Z" {...stroke} fill="#FFD43A" />
      <path d="M30 14 L32 12 L30 10" {...stroke} />
      <circle cx="32" cy="20" r="1" fill="#1a1a1a" />
      <circle cx="28" cy="26" r="1" fill="#1a1a1a" />
    </svg>
  ),
};

// Map of chore_id -> icon key
const CHORE_ICONS = {
  dog_poop: 'dogPoop',
  toilet: 'toilet',
  weeds: 'weeds',
  lawn: 'lawn',
  brush_avery: 'dog',
  vac_kitchen: 'vacuum',
  vac_upstairs: 'upstairs',
  vac_bedroom: 'bedroom',
  vac_stairs: 'stairs',
  laundry_full: 'laundryFull',
  laundry_put: 'laundryPut',
  tp_restock: 'toiletPaper',
  sanitizer: 'sanitizer',
  empty_dw: 'dishwasherEmpty',
  load_dw: 'dishwasherLoad',
  stair_basket: 'basket',
  dust_rails: 'duster',
  walk_avery: 'walk',
  play_avery: 'play',
  windex_door: 'windex',
  mirrors: 'mirror',
  bath_trash: 'trash',
  bath_sinks: 'sink',
  bedding_off: 'beddingOff',
  bedding_on: 'beddingOn',
  art_cabinet: 'art',
  mop_kitchen: 'mop',
  mop_entry: 'mop',
};

const STREAK_ICONS = {
  piano_hw: 'piano',
  beds_rooms: 'bedMade',
  backpacks: 'backpack',
  kindness: 'heart',
  bedtime: 'moon',
};

const ChoreIcon = ({ iconKey, size = 38 }) => {
  const icon = Icons[iconKey];
  if (!icon) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {icon.props.children}
    </svg>
  );
};

// ---------- Helpers ----------
const getWeekKey = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
};

const formatWeekLabel = (key) => {
  const d = new Date(key + 'T00:00:00');
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  const opts = { month: 'short', day: 'numeric' };
  return `${d.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
};

const fmt = (n) => `$${n.toFixed(2)}`;

const computeStreakTotal = (streakChecks) => {
  let total = 0;
  STREAKS.forEach(s => {
    const checks = streakChecks?.[s.id] || {};
    if (s.payType === 'per_check') {
      total += s.rate * s.days.filter(d => checks[d]).length;
    } else if (s.days.every(d => checks[d])) {
      total += s.rate;
    }
  });
  return total;
};

const computeStreakEarned = (s, checks) => {
  if (s.payType === 'per_check') {
    return s.rate * s.days.filter(d => checks[d]).length;
  }
  return s.days.every(d => checks[d]) ? s.rate : 0;
};

const KID_STYLES = ['short', 'curly', 'pigtails'];

export default function ChoreTracker() {
  const [currentWeek, setCurrentWeek] = useState(getWeekKey());
  const [counts, setCounts] = useState({});
  const [streaks, setStreaks] = useState({});
  const [history, setHistory] = useState({});
  const [activeKid, setActiveKid] = useState(KIDS[0]);
  const [section, setSection] = useState('streaks');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const initEmpty = () => {
    const c = {}, s = {};
    KIDS.forEach(k => { c[k] = {}; s[k] = {}; });
    return { c, s };
  };

  useEffect(() => {
    (async () => {
      const weekKey = getWeekKey();
      setCurrentWeek(weekKey);
      const { c, s } = initEmpty();

      try {
        const result = await storage.get(`week:${weekKey}`);
        if (result?.value) {
          const parsed = JSON.parse(result.value);
          setCounts(parsed.counts || c);
          setStreaks(parsed.streaks || s);
        } else {
          setCounts(c); setStreaks(s);
        }
      } catch {
        setCounts(c); setStreaks(s);
      }

      try {
        // Single bulk call for history + summaries — much faster than N round-trips
        const { historyIndex, summaries } = await storage.bulkLoad();
        const histData = {};
        for (const key of historyIndex || []) {
          if (key === weekKey) continue;
          if (summaries[key]) histData[key] = summaries[key];
        }
        setHistory(histData);
      } catch {}

      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await storage.set(`week:${currentWeek}`, JSON.stringify({ counts, streaks }));
        const summary = {};
        KIDS.forEach(kid => {
          const choreT = Object.entries(counts[kid] || {}).reduce((s, [cid, n]) => {
            const c = CHORES.find(x => x.id === cid);
            return s + (c ? c.rate * n : 0);
          }, 0);
          const streakT = computeStreakTotal(streaks[kid] || {});
          summary[kid] = { total: choreT + streakT, choreTotal: choreT, streakTotal: streakT };
        });
        await storage.set(`summary:${currentWeek}`, JSON.stringify(summary));

        try {
          const idxResult = await storage.get('history-index');
          let idx = idxResult?.value ? JSON.parse(idxResult.value) : [];
          if (!idx.includes(currentWeek)) {
            idx.push(currentWeek);
            await storage.set('history-index', JSON.stringify(idx));
          }
        } catch {
          await storage.set('history-index', JSON.stringify([currentWeek]));
        }
      } catch (err) {
        console.error('Save error:', err);
      }
    })();
  }, [counts, streaks, currentWeek, loaded]);

  const increment = (kid, choreId) => {
    setCounts(prev => ({
      ...prev,
      [kid]: { ...(prev[kid] || {}), [choreId]: (prev[kid]?.[choreId] || 0) + 1 }
    }));
  };
  const decrement = (kid, choreId) => {
    setCounts(prev => {
      const cur = prev[kid]?.[choreId] || 0;
      if (cur <= 0) return prev;
      return { ...prev, [kid]: { ...(prev[kid] || {}), [choreId]: cur - 1 } };
    });
  };

  const toggleStreak = (kid, streakId, dayIdx) => {
    setStreaks(prev => {
      const kidStreaks = prev[kid] || {};
      const streakDays = kidStreaks[streakId] || {};
      const newDays = { ...streakDays, [dayIdx]: !streakDays[dayIdx] };
      return { ...prev, [kid]: { ...kidStreaks, [streakId]: newDays } };
    });
  };

  const resetWeek = async () => {
    if (!confirm('Start a new week? Current week will be saved to history.')) return;
    const { c, s } = initEmpty();
    const newWeek = getWeekKey();
    try {
      const oldSummary = await storage.get(`summary:${currentWeek}`);
      if (oldSummary?.value) {
        setHistory(prev => ({ ...prev, [currentWeek]: JSON.parse(oldSummary.value) }));
      }
    } catch {}
    setCurrentWeek(newWeek);
    setCounts(c);
    setStreaks(s);
  };

  const choreTotal = (kid) => Object.entries(counts[kid] || {}).reduce((sum, [cid, n]) => {
    const c = CHORES.find(x => x.id === cid);
    return sum + (c ? c.rate * n : 0);
  }, 0);
  const streakTotal = (kid) => computeStreakTotal(streaks[kid] || {});
  const kidTotal = (kid) => choreTotal(kid) + streakTotal(kid);
  const grandTotal = () => KIDS.reduce((s, k) => s + kidTotal(k), 0);
  const historyTotal = (kid) => Object.values(history).reduce((s, w) => s + (w[kid]?.total || 0), 0);

  const sortedHistoryKeys = Object.keys(history).sort().reverse();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap');

        * { box-sizing: border-box; }

        .ct-root {
          --yellow: #FFD43A;
          --yellow-soft: #FFF0B3;
          --yellow-deep: #F2C300;
          --ink: #1a1a1a;
          --white: #ffffff;
          --gray: #888;

          background: var(--yellow);
          color: var(--ink);
          font-family: 'Patrick Hand', cursive;
          min-height: 100vh;
          padding: 24px 16px 80px;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative suns scattered in background */
        .ct-sun-bg {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .ct-sun-1 { top: 40px; right: 30px; }
        .ct-sun-2 { top: 280px; left: 10px; }
        .ct-sun-3 { bottom: 100px; right: 10px; }

        .ct-container {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Top header */
        .ct-header {
          text-align: center;
          margin-bottom: 18px;
        }
        .ct-title {
          font-family: 'Caveat Brush', cursive;
          font-weight: 400;
          font-size: 54px;
          line-height: 0.95;
          letter-spacing: 0.01em;
          margin: 0;
          color: var(--ink);
          text-shadow: 2px 2px 0 var(--white);
        }
        .ct-subtitle {
          font-size: 18px;
          color: var(--ink);
          opacity: 0.75;
          margin-top: 2px;
        }

        /* White card frame */
        .ct-card {
          background: var(--white);
          border: 2.5px solid var(--ink);
          border-radius: 28px;
          padding: 22px 20px;
          margin-top: 16px;
          box-shadow: 4px 4px 0 var(--ink);
          position: relative;
        }

        .ct-week-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ct-week {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 600;
        }
        .ct-week small {
          font-family: 'Patrick Hand', cursive;
          font-size: 14px;
          opacity: 0.6;
          display: block;
        }
        .ct-reset {
          background: var(--white);
          border: 2px solid var(--ink);
          color: var(--ink);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 15px;
          font-family: 'Patrick Hand', cursive;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.1s;
        }
        .ct-reset:hover {
          background: var(--yellow);
          transform: translate(-1px, -1px);
        }
        .ct-reset:active { transform: translate(1px, 1px); }

        .ct-grand {
          font-family: 'Caveat', cursive;
          font-size: 20px;
          text-align: center;
          padding: 12px;
          background: var(--yellow-soft);
          border-radius: 16px;
          border: 2px dashed var(--ink);
          margin-bottom: 20px;
        }
        .ct-grand b {
          font-family: 'Caveat Brush', cursive;
          font-size: 30px;
          font-weight: 400;
          margin-left: 6px;
          vertical-align: middle;
        }

        /* Kid avatar tabs */
        .ct-kids {
          display: flex;
          justify-content: center;
          gap: 18px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .ct-kid-tab {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          font-family: 'Patrick Hand', cursive;
          color: var(--ink);
          text-align: center;
          transition: transform 0.15s;
        }
        .ct-kid-tab:hover { transform: scale(1.06); }
        .ct-avatar-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--white);
          border: 2.5px solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 4px;
          position: relative;
          transition: all 0.2s;
        }
        .ct-kid-tab.active .ct-avatar-wrap {
          background: var(--yellow);
          transform: scale(1.08);
          box-shadow: 3px 3px 0 var(--ink);
        }
        .ct-kid-name {
          font-size: 17px;
          font-weight: 400;
          display: block;
          line-height: 1.1;
        }
        .ct-kid-amount {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          font-weight: 700;
          background: var(--ink);
          color: var(--yellow);
          padding: 1px 8px;
          border-radius: 999px;
          display: inline-block;
          margin-top: 2px;
        }

        /* Section toggle */
        .ct-section-toggle {
          display: flex;
          background: var(--white);
          border: 2.5px solid var(--ink);
          border-radius: 999px;
          padding: 4px;
          margin: 0 auto 18px;
          gap: 2px;
          width: fit-content;
          box-shadow: 3px 3px 0 var(--ink);
        }
        .ct-section-btn {
          background: transparent;
          border: none;
          padding: 8px 22px;
          border-radius: 999px;
          font-family: 'Patrick Hand', cursive;
          font-size: 17px;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
        }
        .ct-section-btn.active {
          background: var(--ink);
          color: var(--yellow);
        }

        /* Streak list */
        .ct-streak-card-head {
          text-align: center;
          margin-bottom: 4px;
        }
        .ct-streak-h {
          font-family: 'Caveat Brush', cursive;
          font-size: 36px;
          font-weight: 400;
          margin: 0;
          line-height: 1;
        }
        .ct-streak-sub {
          font-family: 'Caveat', cursive;
          font-size: 17px;
          opacity: 0.7;
          margin-top: 2px;
          margin-bottom: 14px;
        }

        .ct-streak-row {
          padding: 14px 4px;
          border-bottom: 2px dashed var(--ink);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
        }
        .ct-streak-row:last-child { border-bottom: none; }

        .ct-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--yellow-soft);
          border: 2px solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .ct-icon-wrap.active {
          background: var(--yellow);
          transform: rotate(-3deg) scale(1.05);
          box-shadow: 2px 2px 0 var(--ink);
        }
        .ct-icon-wrap.won {
          background: var(--yellow);
          box-shadow: 2px 2px 0 var(--ink);
        }

        .ct-streak-name {
          font-family: 'Patrick Hand', cursive;
          font-size: 17px;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .ct-streak-meta {
          font-family: 'Caveat', cursive;
          font-size: 16px;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ct-streak-rate { font-weight: 700; }
        .ct-streak-badge {
          font-family: 'Patrick Hand', cursive;
          font-size: 12px;
          padding: 2px 9px;
          border-radius: 999px;
          border: 1.5px solid var(--ink);
          background: var(--white);
        }
        .ct-streak-badge.full {
          background: var(--yellow);
          font-weight: bold;
        }

        .ct-streak-controls {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ct-days { display: flex; gap: 5px; }
        .ct-day {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid var(--ink);
          background: var(--white);
          cursor: pointer;
          font-family: 'Caveat Brush', cursive;
          font-size: 15px;
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          padding: 0;
        }
        .ct-day:hover:not(:disabled) { transform: scale(1.1); }
        .ct-day.checked {
          background: var(--ink);
          color: var(--yellow);
          border-color: var(--ink);
        }
        .ct-day:disabled {
          opacity: 0.18;
          cursor: not-allowed;
          border-style: dashed;
        }

        .ct-streak-earned {
          font-family: 'Caveat Brush', cursive;
          font-size: 22px;
          min-width: 60px;
          text-align: right;
        }
        .ct-streak-earned.zero { color: #ccc; }
        .ct-streak-earned.won {
          color: var(--ink);
          background: var(--yellow);
          padding: 2px 10px;
          border-radius: 12px;
          border: 2px solid var(--ink);
        }

        /* Chore list */
        .ct-chore-row {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: 12px;
          align-items: center;
          padding: 14px 4px;
          border-bottom: 2px dashed var(--ink);
        }
        .ct-chore-row:last-child { border-bottom: none; }
        .ct-chore-row.active { background: var(--yellow-soft); border-radius: 10px; padding-left: 10px; padding-right: 10px; }

        .ct-chore-name {
          font-family: 'Patrick Hand', cursive;
          font-size: 17px;
          line-height: 1.2;
        }
        .ct-chore-meta {
          font-family: 'Caveat', cursive;
          font-size: 15px;
          margin-top: 1px;
        }
        .ct-rate { font-weight: 700; }
        .ct-note { opacity: 0.6; margin-left: 4px; }

        .ct-controls { display: flex; align-items: center; gap: 6px; }
        .ct-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid var(--ink);
          background: var(--white);
          color: var(--ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .ct-btn:hover { background: var(--yellow); transform: scale(1.08); }
        .ct-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .ct-btn:disabled:hover { background: var(--white); transform: none; }

        .ct-count {
          min-width: 26px;
          text-align: center;
          font-family: 'Caveat Brush', cursive;
          font-size: 22px;
        }
        .ct-count.zero { color: #ccc; }

        .ct-earned {
          font-family: 'Caveat Brush', cursive;
          font-size: 22px;
          min-width: 64px;
          text-align: right;
        }
        .ct-earned.zero { color: #ccc; }

        /* Total bar */
        .ct-total {
          margin-top: 18px;
          padding: 18px 22px;
          background: var(--ink);
          color: var(--yellow);
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          box-shadow: 4px 4px 0 var(--yellow-deep);
        }
        .ct-total-label {
          font-family: 'Caveat', cursive;
          font-size: 22px;
        }
        .ct-total-amount {
          font-family: 'Caveat Brush', cursive;
          font-size: 44px;
          line-height: 1;
        }
        .ct-total-breakdown {
          font-family: 'Patrick Hand', cursive;
          font-size: 14px;
          opacity: 0.75;
          width: 100%;
          text-align: center;
        }

        /* History */
        .ct-history {
          margin-top: 26px;
        }
        .ct-history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
          padding: 14px 18px;
          background: var(--white);
          border: 2.5px solid var(--ink);
          border-radius: 18px;
          box-shadow: 3px 3px 0 var(--ink);
        }
        .ct-history-title {
          font-family: 'Caveat Brush', cursive;
          font-size: 30px;
          margin: 0;
        }
        .ct-history-summary {
          display: grid;
          grid-template-columns: repeat(${KIDS.length}, 1fr);
          gap: 10px;
          margin-top: 14px;
        }
        .ct-history-kid {
          padding: 14px;
          background: var(--white);
          border: 2px solid var(--ink);
          border-radius: 16px;
          text-align: center;
        }
        .ct-history-kid-name {
          font-family: 'Patrick Hand', cursive;
          font-size: 15px;
          opacity: 0.7;
        }
        .ct-history-kid-total {
          font-family: 'Caveat Brush', cursive;
          font-size: 32px;
          margin-top: 2px;
          line-height: 1;
        }

        .ct-history-weeks {
          margin-top: 14px;
          background: var(--white);
          border: 2px solid var(--ink);
          border-radius: 16px;
          padding: 6px 16px;
        }
        .ct-history-week {
          padding: 12px 0;
          border-bottom: 1.5px dashed var(--ink);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 14px;
          align-items: center;
        }
        .ct-history-week:last-child { border-bottom: none; }
        .ct-history-week-label {
          font-family: 'Caveat', cursive;
          font-size: 17px;
        }
        .ct-history-week-breakdown {
          display: flex;
          gap: 14px;
          font-family: 'Patrick Hand', cursive;
          font-size: 15px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .ct-history-week-breakdown b {
          font-family: 'Caveat Brush', cursive;
          font-size: 18px;
          font-weight: 400;
        }

        .ct-empty {
          padding: 22px;
          text-align: center;
          font-family: 'Caveat', cursive;
          font-size: 18px;
          opacity: 0.6;
        }

        @media (max-width: 600px) {
          .ct-title { font-size: 42px; }
          .ct-streak-row {
            grid-template-columns: auto 1fr;
            gap: 10px;
          }
          .ct-streak-controls {
            grid-column: 1 / -1;
            justify-content: space-between;
            width: 100%;
          }
          .ct-chore-row {
            grid-template-columns: auto 1fr auto;
            gap: 10px;
          }
          .ct-chore-row .ct-earned {
            grid-column: 2 / 4;
            text-align: right;
            font-size: 18px;
            margin-top: -6px;
          }
          .ct-day { width: 28px; height: 28px; font-size: 13px; }
          .ct-total-amount { font-size: 36px; }
          .ct-history-summary { grid-template-columns: 1fr; }
          .ct-kids { gap: 12px; }
          .ct-avatar-wrap { width: 56px; height: 56px; }
          .ct-icon-wrap { width: 46px; height: 46px; }
        }
      `}</style>

      <div className="ct-root">
        <div className="ct-sun-bg ct-sun-1"><Sun size={90} opacity={0.22} /></div>
        <div className="ct-sun-bg ct-sun-2"><Sun size={70} opacity={0.18} /></div>
        <div className="ct-sun-bg ct-sun-3"><Sun size={80} opacity={0.2} /></div>

        <div className="ct-container">
          <div className="ct-header">
            <h1 className="ct-title">Chore Chart</h1>
            <div className="ct-subtitle">~ heroic deeds & daily quests ~</div>
          </div>

          <div className="ct-card">
            <div className="ct-week-row">
              <div className="ct-week">
                This Week
                <small>{formatWeekLabel(currentWeek)}</small>
              </div>
              <button className="ct-reset" onClick={resetWeek} title="Start a new week">
                <RotateCcw size={14} /> New week
              </button>
            </div>

            <div className="ct-grand">
              all together <b>{fmt(grandTotal())}</b>
            </div>

            <div className="ct-kids">
              {KIDS.map((kid, i) => (
                <button
                  key={kid}
                  className={`ct-kid-tab ${activeKid === kid ? 'active' : ''}`}
                  onClick={() => setActiveKid(kid)}
                >
                  <div className="ct-avatar-wrap">
                    <KidFace size={44} hair={KID_STYLES[i % KID_STYLES.length]} />
                  </div>
                  <span className="ct-kid-name">{kid}</span>
                  <div>
                    <span className="ct-kid-amount">{fmt(kidTotal(kid))}</span>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="ct-section-toggle">
                <button
                  className={`ct-section-btn ${section === 'streaks' ? 'active' : ''}`}
                  onClick={() => setSection('streaks')}
                >
                  ★ Streaks
                </button>
                <button
                  className={`ct-section-btn ${section === 'chores' ? 'active' : ''}`}
                  onClick={() => setSection('chores')}
                >
                  ✓ Chores
                </button>
              </div>
            </div>

            {section === 'streaks' && (
              <>
                <div className="ct-streak-card-head">
                  <h2 className="ct-streak-h">Heroic Streaks</h2>
                  <div className="ct-streak-sub">tap a day to mark it done!</div>
                </div>
                {STREAKS.map(s => {
                  const kidStreaks = streaks[activeKid]?.[s.id] || {};
                  const earned = computeStreakEarned(s, kidStreaks);
                  const isFullStreakWon = s.payType === 'full_streak' && earned > 0;
                  const hasAnyCheck = s.days.some(d => kidStreaks[d]);
                  return (
                    <div key={s.id} className="ct-streak-row">
                      <div className={`ct-icon-wrap ${isFullStreakWon ? 'won' : hasAnyCheck ? 'active' : ''}`}>
                        <ChoreIcon iconKey={STREAK_ICONS[s.id]} size={38} />
                      </div>
                      <div>
                        <div className="ct-streak-name">{s.name}</div>
                        <div className="ct-streak-meta">
                          <span className="ct-streak-rate">
                            {s.payType === 'per_check' ? `${fmt(s.rate)} / day` : `${fmt(s.rate)} streak`}
                          </span>
                          <span className={`ct-streak-badge ${s.payType === 'full_streak' ? 'full' : ''}`}>
                            {s.payType === 'per_check' ? 'per day' : 'all or nothing'}
                          </span>
                        </div>
                      </div>
                      <div className="ct-streak-controls">
                        <div className="ct-days">
                          {DAY_LABELS.map((label, idx) => {
                            const active = s.days.includes(idx);
                            const checked = !!kidStreaks[idx];
                            return (
                              <button
                                key={idx}
                                className={`ct-day ${checked ? 'checked' : ''}`}
                                disabled={!active}
                                onClick={() => active && toggleStreak(activeKid, s.id, idx)}
                                aria-label={`${label} ${checked ? 'completed' : 'incomplete'}`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        <div className={`ct-streak-earned ${earned === 0 ? 'zero' : ''} ${isFullStreakWon ? 'won' : ''}`}>
                          {fmt(earned)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {section === 'chores' && (
              <>
                <div className="ct-streak-card-head">
                  <h2 className="ct-streak-h">Chore Quests</h2>
                  <div className="ct-streak-sub">tap + when you finish one!</div>
                </div>
                {CHORES.map(chore => {
                  const n = counts[activeKid]?.[chore.id] || 0;
                  const earned = chore.rate * n;
                  return (
                    <div key={chore.id} className={`ct-chore-row ${n > 0 ? 'active' : ''}`}>
                      <div className={`ct-icon-wrap ${n > 0 ? 'active' : ''}`}>
                        <ChoreIcon iconKey={CHORE_ICONS[chore.id]} size={38} />
                      </div>
                      <div>
                        <div className="ct-chore-name">{chore.name}</div>
                        <div className="ct-chore-meta">
                          <span className="ct-rate">{fmt(chore.rate)} each</span>
                          {chore.note && <span className="ct-note">· {chore.note}</span>}
                        </div>
                      </div>
                      <div className="ct-controls">
                        <button
                          className="ct-btn"
                          onClick={() => decrement(activeKid, chore.id)}
                          disabled={n === 0}
                          aria-label="decrease"
                        >
                          <Minus size={15} />
                        </button>
                        <div className={`ct-count ${n === 0 ? 'zero' : ''}`}>{n}</div>
                        <button
                          className="ct-btn"
                          onClick={() => increment(activeKid, chore.id)}
                          aria-label="increase"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <div className={`ct-earned ${earned === 0 ? 'zero' : ''}`}>
                        {fmt(earned)}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <div className="ct-total">
              <span className="ct-total-label">{activeKid} earned</span>
              <span className="ct-total-amount">{fmt(kidTotal(activeKid))}</span>
              <div className="ct-total-breakdown">
                streaks {fmt(streakTotal(activeKid))} · chores {fmt(choreTotal(activeKid))}
              </div>
            </div>
          </div>

          <div className="ct-history">
            <div className="ct-history-header" onClick={() => setHistoryOpen(o => !o)}>
              <h2 className="ct-history-title">Past Weeks</h2>
              {historyOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>

            <div className="ct-history-summary">
              {KIDS.map(kid => (
                <div key={kid} className="ct-history-kid">
                  <div className="ct-history-kid-name">{kid} · all-time</div>
                  <div className="ct-history-kid-total">
                    {fmt(historyTotal(kid) + kidTotal(kid))}
                  </div>
                </div>
              ))}
            </div>

            {historyOpen && (
              <div className="ct-history-weeks">
                {sortedHistoryKeys.length === 0 ? (
                  <div className="ct-empty">No past weeks yet — they'll show up here once you start a new week!</div>
                ) : (
                  sortedHistoryKeys.map(wk => (
                    <div key={wk} className="ct-history-week">
                      <div className="ct-history-week-label">{formatWeekLabel(wk)}</div>
                      <div className="ct-history-week-breakdown">
                        {KIDS.map(kid => (
                          <span key={kid}>
                            {kid}: <b>{fmt(history[wk]?.[kid]?.total || 0)}</b>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
