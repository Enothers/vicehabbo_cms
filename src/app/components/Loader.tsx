export default function Loader() {
  return (
    <>
      <div style={{
        position: 'absolute', // Positionnement absolu
        top: '400px',          // 50% depuis le haut du parent positionné
        left: '50%',         // 50% depuis la gauche du parent positionné
        transform: 'translateX(-50%)', // Centrage parfait en utilisant la translation
        zIndex: 1000,             // S'assurer qu'il est au-dessus des autres éléments
      }}>
        <div style={{
          border: '6px solid #f3f3f3',
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