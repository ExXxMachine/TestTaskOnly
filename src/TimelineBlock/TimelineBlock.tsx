import React, { useState, useEffect } from 'react'
import './TimelineBlock.scss'
import { CircleNav } from '../CircleNav/CircleNav'
import { periods } from '../entities/TestData'
import useAnimatedNumber from '../features/useAnimatedNumber'
import { EventSlider } from '../EventSlider/EventSlider'

function TimelineBlock() {
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const [fade, setFade] = useState(true)
	const [visibleIndex, setVisibleIndex] = useState<number>(0)

	const start = useAnimatedNumber(periods[visibleIndex].start)
	const end = useAnimatedNumber(periods[visibleIndex].end)

	useEffect(() => {
		setFade(false)
		const timeout = setTimeout(() => {
			setVisibleIndex(activeIndex)
			setFade(true)
		}, 400) 

		return () => clearTimeout(timeout)
	}, [activeIndex])

	const handleIncrementIndex = () => {
		if (activeIndex < periods.length - 1) setActiveIndex(activeIndex + 1)
	}
	const handleDecrementIndex = () => {
		if (activeIndex > 0) setActiveIndex(activeIndex - 1)
	}

	const handleNavigationButton = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setActiveIndex(+event.currentTarget.value - 1)
	}

	return (
		<div className='timeline-block'>
			<h1>
				Исторические
				<br />
				даты
			</h1>
			<div className='timeline-circle'>
				<CircleNav
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
					periods={periods.map(({ id, title }) => ({ id, title }))}
				/>
			</div>
			<div className='timeline-periods'>
				<p>
					{start}
					<span> {end}</span>
				</p>
			</div>
			<div className='timeline-buttons-block'>
				<p>{`0${activeIndex + 1}/0${periods.length}`}</p>
				<div className='buttons-row'>
					<button
						className='timeline-button'
						disabled={activeIndex === 0}
						onClick={handleDecrementIndex}
						aria-label='Предыдущий период'
						title='Предыдущий период'
					/>
					<button
						className='timeline-button'
						disabled={activeIndex === periods.length - 1}
						onClick={handleIncrementIndex}
						aria-label='Следующий период'
						title='Следующий период'
					/>
				</div>
			</div>
			<div className='timeline-text-mobile'>
				<p className={fade ? 'fade-in' : 'fade-out'}>
					{periods[visibleIndex].title}
				</p>
			</div>
			<div className={`timeline-slider-block ${fade ? 'fade-in' : 'fade-out'}`}>
				<EventSlider events={periods[visibleIndex].events} />
			</div>
			<div className={'timeline-navigation-point'}>
				{periods.map((period, index)=> (
					<button
						onClick={handleNavigationButton}
						value={period.id}
						className={index === activeIndex ? 'active' : ''}
					/>
				))}
			</div>
		</div>
	)
}

export { TimelineBlock }
