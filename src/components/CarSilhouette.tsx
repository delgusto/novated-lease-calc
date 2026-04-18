export type CarVariant = 'sedan' | 'suv-compact' | 'suv';

export function CarSilhouette({ variant, className }: { variant: CarVariant; className?: string }) {
  const wheelProps = {
    fill: 'currentColor' as const,
    stroke: 'var(--background)',
    strokeWidth: 1.5,
    r: 5,
  };

  if (variant === 'sedan') {
    // Low, sleek profile — Tesla Model 3 fastback shape
    return (
      <svg viewBox="0 0 64 28" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M2,24 L2,20 L8,17 L14,10 C18,6 24,5 30,5 C36,5 42,6 46,10 L52,17 L56,19 L62,20 L62,24 Z"
        />
        <circle cx={14} cy={23} {...wheelProps} />
        <circle cx={50} cy={23} {...wheelProps} />
      </svg>
    );
  }

  if (variant === 'suv-compact') {
    // Taller, rounder — BYD Atto 3 / Kia EV5 crossover shape
    return (
      <svg viewBox="0 0 64 30" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M2,26 L2,20 L6,16 L12,8 C16,5 22,4 30,4 C38,4 44,5 48,8 L54,16 L58,20 L62,22 L62,26 Z"
        />
        <circle cx={14} cy={25} {...wheelProps} />
        <circle cx={50} cy={25} {...wheelProps} />
      </svg>
    );
  }

  // Boxy SUV — Toyota RAV4 upright shape
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M2,28 L2,18 L6,14 L12,7 C14,4 20,3 30,3 C40,3 46,4 50,7 L54,14 L58,18 L62,20 L62,28 Z"
      />
      <circle cx={14} cy={27} r={5.5} fill="currentColor" stroke="var(--background)" strokeWidth={1.5} />
      <circle cx={50} cy={27} r={5.5} fill="currentColor" stroke="var(--background)" strokeWidth={1.5} />
    </svg>
  );
}
