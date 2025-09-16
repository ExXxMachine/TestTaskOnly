import React from 'react'
import './TimelineBlock.scss'
import { CircleNav } from '../CircleNav/CircleNav'

function TimelineBlock() {
	return (
		<div className='timeline-block'>
			<h1>
				{' '}
				Исторические
				<br />
				даты
			</h1>
			<div className='timeline-circle'>
				<CircleNav />
			</div>
		</div>
	)
}

export { TimelineBlock }
