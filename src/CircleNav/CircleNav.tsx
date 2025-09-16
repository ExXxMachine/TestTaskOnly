import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './CircleNav.scss'

interface Point {
	id: number
	title: string
}

const points: Point[] = [
	{ id: 1, title: 'Первый' },
	{ id: 2, title: 'Второй' },
	{ id: 3, title: 'Третий' },
	{ id: 4, title: 'Четвёртый' },
	{ id: 5, title: 'Пятый' },
	{ id: 6, title: 'Шестой' },
]

const CircleNav: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const circleRef = useRef<HTMLDivElement>(null)
	const pointRefs = useRef<(HTMLButtonElement | null)[]>([])
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const NUM_POINTS = points.length

	useEffect(() => {
		if (!circleRef.current) return
		const resizeObserver = new ResizeObserver(entries => {
			if (!entries || entries.length === 0) return
			const entry = entries[0]
			const cr = entry.contentRect
			setDimensions({ width: cr.width, height: cr.height })
		})

		resizeObserver.observe(circleRef.current)

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

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

	const getRotation = (el: HTMLElement): number => {
		const st = window.getComputedStyle(el, null)
		const tr = st.getPropertyValue('transform')
		if (tr === 'none') return 0
		const values = tr.split('(')[1].split(')')[0].split(',').map(parseFloat)
		const a = values[0],
			b = values[1]
		return Math.round((Math.atan2(b, a) * 180) / Math.PI)
	}

	const rotateToPoint = (index: number) => {
		if (!circleRef.current) return
		if (activeIndex === index) return

		const oldIndex = activeIndex
		const angleStep = 360 / NUM_POINTS

		const targetRotation = -angleStep * index 

		if (oldIndex !== null && pointRefs.current[oldIndex]) {
			const el = pointRefs.current[oldIndex]
			if (el) {
				el.style.width = '6px'
				el.style.height = '6px'
				el.style.backgroundColor = '#42567A'
				el.style.fontSize = '0px'
				el.style.boxShadow = 'none'
				el.style.border = 'none'
			}
		}

		const tl = gsap.timeline({
			onComplete: () => setActiveIndex(index),
		})

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

	useEffect(() => {
		if (dimensions.width && dimensions.height) {
			rotateToPoint(activeIndex)
		}
	}, [dimensions])

	return (
		<>
			<div ref={circleRef} className='circle-nav'>
				{points.map((point, i) => {
					const pos = getPointPosition(i)
					const isActive = activeIndex === i
					return (
						<button
							key={point.id}
							ref={el => {
								pointRefs.current[i] = el
							}}
							onClick={() => rotateToPoint(i)}
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
							title={point.title}
						>
							{isActive || hoveredIndex === i ? point.id : ''}
						</button>
					)
				})}
				</div>
		</>
	)
}

export { CircleNav }
 