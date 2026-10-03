const ProgressBar: React.FC<{ percent: string }> = ({ percent }) => {
    const value = Number(percent)
    const width = isFinite(value) ? Math.min(100, value) : 0
    return (
        <div className='relative h-3 w-full overflow-hidden bg-secondary' title={`${percent}%`}>
            <div
                className='h-full bg-gradient-to-r from-teamOrange to-teamOrange-light'
                style={{ width: `${width}%`, transformOrigin: 'left', animation: 'fillAnimation 1s ease' }}
            />
        </div>
    )
}

export default ProgressBar
