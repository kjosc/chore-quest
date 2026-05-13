'use client';

import PinGate from '../components/PinGate';
import ChoreTracker from '../components/ChoreTracker';

export default function Home() {
  return (
    <PinGate>
      <ChoreTracker />
    </PinGate>
  );
}
