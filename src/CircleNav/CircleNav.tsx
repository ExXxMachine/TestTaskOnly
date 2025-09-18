import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './CircleNav.scss'

interface Period {
	id: number
	title: string
}
interface CircleNavProps {
	activeIndex: number
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>
	periods: Period[]
}


const CircleNav: React.FC<CircleNavProps> = ({
	activeIndex,
	setActiveIndex,
	periods,
}) => {
	const circleRef = useRef<HTMLDivElement>(null)
	const pointRefs = useRef<(HTMLButtonElement | null)[]>([])
	const [visible, setVisible] = useState(true)
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const NUM_POINTS = periods.length

	// Обновление размеров контейнера
	useEffect(() => {
		if (!circleRef.current) return
		const resizeObserver = new ResizeObserver(entries => {
			const entry = entries[0]
			setDimensions({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			})
		})
		resizeObserver.observe(circleRef.current)
		return () => resizeObserver.disconnect()
	}, [])

	// Позиция точек на окружности
	const CENTER_X = dimensions.width / 2
	const CENTER_Y = dimensions.height / 2
	const RADIUS = Math.min(CENTER_X, CENTER_Y)

	const getPointPosition = (index: number) => {
		const angle = (360 / NUM_POINTS) * index - 60
		const rad = (angle * Math.PI) / 180
		return {
			x: CENTER_X + RADIUS * Math.cos(rad),
			y: CENTER_Y + RADIUS * Math.sin(rad),
		}
	}

	// Получение текущего поворота
	const getRotation = (el: HTMLElement): number => {
		const st = window.getComputedStyle(el)
		const tr = st.getPropertyValue('transform')
		if (tr === 'none') return 0
		const values = tr.split('(')[1].split(')')[0].split(',').map(parseFloat)
		return Math.round((Math.atan2(values[1], values[0]) * 180) / Math.PI)
	}

	// Поворот круга и выделение активной точки
	const rotateToPoint = (index: number) => {
		if (!circleRef.current) return

		// Ручное сброс старой точки
		if (pointRefs.current[activeIndex]) {
			const el = pointRefs.current[activeIndex]
			if (el) {
				el.style.width = '6px'
				el.style.height = '6px'
				el.style.backgroundColor = '#42567A'
				el.style.fontSize = '0px'
				el.style.boxShadow = 'none'
				el.style.border = 'none'
			}
		}

		const angleStep = 360 / NUM_POINTS
		const targetRotation = -angleStep * index

		// Синхронно изменяем индекс, чтобы не было рассинхронизации
		setActiveIndex(index)

		const tl = gsap.timeline()
		tl.to(circleRef.current, {
			rotation: targetRotation,
			duration: 0.5,
			ease: 'power3.out',
			onUpdate: () => {
				const currentRotation = getRotation(circleRef.current!)
				pointRefs.current.forEach(el => {
					if (el) gsap.set(el, { rotation: -currentRotation })
				})
			},
		})
		tl.to(
			pointRefs.current[index],
			{
				width: '56px',
				height: '56px',
				backgroundColor: '#f4f5f9',
				color: '#42567A',
				fontSize: 20,
				border: '#303E58 solid 1px',
				duration: 0.25,
				ease: 'power1.inOut',
			},
			'>'
		)
	}


	// Управление анимацией текста при смене активной точки
	const handleChange = (index: number) => {
		setVisible(false)
		setTimeout(() => {
			setActiveIndex(index)
			setVisible(true)
		}, 400)
	}

	// Автоматический поворот после измерения размеров
	useEffect(() => {
		if (dimensions.width && dimensions.height) {
			handleChange(activeIndex)
			rotateToPoint(activeIndex)
			
		}
	}, [dimensions, activeIndex])

	return (
		<>
			<div ref={circleRef} className='circle-nav'>
				{periods.map((period, i) => {
					const pos = getPointPosition(i)
					const isActive = activeIndex === i
					return (
						<button
							key={period.id}
							ref={el => {
								pointRefs.current[i] = el
							}}
							onClick={() => {
								if (i !== activeIndex) {
									rotateToPoint(i)
									handleChange(i)
								}
							}}
							onMouseEnter={() => setHoveredIndex(i)}
							onMouseLeave={() => setHoveredIndex(null)}
							className={`circle-point${isActive ? ' active' : ''}`}
							style={{
								top: pos.y,
								left: pos.x,
								width: isActive || hoveredIndex === i ? '56px' : '6px',
								height: isActive || hoveredIndex === i ? '56px' : '6px',
								backgroundColor:
									isActive || hoveredIndex === i ? '#f4f5f9' : '',
								border:
									isActive || hoveredIndex === i ? '#303E58 solid 1px' : '',
								fontSize: isActive || hoveredIndex === i ? '20px' : '0px',
							}}
							title={period.title}
						>
							{isActive || hoveredIndex === i ? period.id : ''}
						</button>
					)
				})}
			</div>

			{/* Текст названия активной точки с анимацией */}
			<div className={`circle-nav-text${visible ? '' : ' hidden'}`}>
				{periods[activeIndex].title}
			</div>
		</>
	)
}

export { CircleNav }
