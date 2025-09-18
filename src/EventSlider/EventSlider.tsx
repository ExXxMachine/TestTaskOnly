import React, { useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type SwiperClass from 'swiper'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import './EventSlider.scss'

interface Event {
	year: number
	text: string
}
interface EventSliderProps {
	events: Event[]
}

const EventSlider: React.FC<EventSliderProps> = ({ events }) => {
	const swiperRef = useRef<SwiperClass | null>(null)
	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)
	const [visibleEvents, setVisibleEvents] = useState(events)
	const [fade, setFade] = useState(true)

	// При смене props.events запускаем анимацию
	useEffect(() => {
		setFade(false)
		const timeout = setTimeout(() => {
			setVisibleEvents(events)
			setFade(true) 
		}, 300) 

		return () => clearTimeout(timeout)
	}, [events])

	const onSlideChange = (swiper: SwiperClass) => {
		setIsBeginning(swiper.isBeginning)
		setIsEnd(swiper.isEnd)
	}

	return (
		<>
			<div className='container'>
				<button
					onClick={() => swiperRef.current?.slidePrev()}
					disabled={isBeginning}
					className='button buttonLeft'
					aria-label='Предыдущее событие'
					title='Предыдущее событие'
				/>
				<Swiper
					onSwiper={swiper => {
						swiperRef.current = swiper
						setIsBeginning(swiper.isBeginning)
						setIsEnd(swiper.isEnd)
					}}
					onSlideChange={swiper => onSlideChange(swiper)}
					modules={[Navigation]}
					navigation={window.innerWidth > 760}
					slidesPerView={3}
					spaceBetween={90}
					breakpoints={{
						0: {
							slidesPerView: 1.4, 
							spaceBetween: 20,
							navigation: false,
						},
						760: {

							slidesPerView: 3,
							spaceBetween: 90,
							navigation: true,
						},
					}}
				>
					{visibleEvents.map((event, index) => (
						<SwiperSlide key={index}>
							<h2 className={fade ? 'fade-in' : 'fade-out'}>{event.year}</h2>
							<p className={fade ? 'fade-in' : 'fade-out'}>{event.text}</p>
						</SwiperSlide>
					))}
				</Swiper>
				<button
					onClick={() => swiperRef.current?.slideNext()}
					disabled={isEnd}
					className='button buttonRight'
					aria-label='Следующе событие'
					title='Следующе событие'
				/>
			</div>
		</>
	)
}

export { EventSlider }
