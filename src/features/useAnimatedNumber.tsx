import React, { useState, useEffect } from 'react'

function useAnimatedNumber(target: number, duration: number = 800) {
	const [value, setValue] = useState(target)

	useEffect(() => {
		let start: number | null = null
		let animFrame: number

		const animate = (timestamp: number) => {
			if (!start) start = timestamp
			const progress = timestamp - start
			const progressRatio = Math.min(progress / duration, 1)

			const newValue = Math.round(value + (target - value) * progressRatio)

			setValue(newValue)

			if (progress < duration) {
				animFrame = requestAnimationFrame(animate)
			} else {
				setValue(target)
			}
		}

		animFrame = requestAnimationFrame(animate)

		return () => cancelAnimationFrame(animFrame)
	}, [target, duration])

	return value
}

export default useAnimatedNumber