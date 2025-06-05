export default function Loader() {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centrage horizontal + vertical
        zIndex: 1000,
      }}>
        <div style={{
          border: '6px solid #EEEEEE',
          borderTop: '6px solid #5B3176',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
