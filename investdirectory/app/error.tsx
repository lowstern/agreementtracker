'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
