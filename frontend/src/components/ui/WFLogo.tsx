interface WFLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showSubtitle?: boolean
}

export function WFLogo({ size = 'md', showText = true, showSubtitle = false }: WFLogoProps) {
  const dim = { sm: 28, md: 36, lg: 48, xl: 64 }[size]
  const title = { sm: 'text-sm', md: 'text-base', lg: 'text-xl', xl: 'text-2xl' }[size]
  const sub = { sm: 'text-[8px]', md: 'text-[9px]', lg: 'text-[10px]', xl: 'text-xs' }[size]

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon mark */}
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
        <div className="absolute inset-0 rounded-lg blur-md opacity-50"
          style={{ background: 'linear-gradient(135deg, #FF8C00, #FF4500)' }} />
        <div className="relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #FF8C00 0%, #E67600 60%, #CC5500 100%)' }}>
          {/* inner shadow top */}
          <div className="absolute inset-x-0 top-0 h-1/3 opacity-30 rounded-t-lg"
            style={{ background: 'linear-gradient(to bottom, #fff, transparent)' }} />
          <svg viewBox="0 0 22 18" width="62%" height="62%" fill="none">
            {/* W */}
            <path d="M1 2l2.2 9L5.8 6 8 11l2.8-9" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {/* F */}
            <path d="M13 2h7M13 2v14M13 9h6" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* spark top-right */}
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
        </div>
      </div>

      {showText && (
        <div className="leading-none">
          <p className={`font-black leading-tight tracking-tight ${title}`}>
            <span style={{
              background: 'linear-gradient(135deg, #f8f8f8 20%, #a8a8a8 55%, #f0f0f0 85%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Welder
            </span>
            <span className="mx-0.5" style={{ color: '#FF8C00' }}> &amp; </span>
            <span style={{
              background: 'linear-gradient(135deg, #FF8C00 20%, #FFB347 55%, #FF6B00 85%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Fusion
            </span>
          </p>
          {showSubtitle && (
            <p className={`${sub} uppercase tracking-[0.18em] font-semibold mt-0.5`} style={{ color: '#6B7280' }}>
              Escola Profissionalizante
            </p>
          )}
        </div>
      )}
    </div>
  )
}
