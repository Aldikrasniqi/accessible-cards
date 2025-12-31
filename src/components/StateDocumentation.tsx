'use client'

import { useState } from 'react'

export interface KeyboardInteraction {
	key: string
	description: string
}

export interface InteractiveState {
	state: string
	description: string
}

export interface AriaAttribute {
	value: string
	purpose: string
}

export interface StateDocumentationProps {
	keyboard?: KeyboardInteraction[]
	screenReader?: string[]
	ariaAttributes?: Record<string, AriaAttribute>
	focusManagement?: string
	interactiveStates?: InteractiveState[]
	title?: string
}

export function StateDocumentation({
	keyboard,
	screenReader,
	ariaAttributes,
	focusManagement,
	interactiveStates,
	title = 'Accessibility Documentation',
}: StateDocumentationProps) {
	const [isOpen, setIsOpen] = useState(true)

	const hasContent =
		(keyboard && keyboard.length > 0) ||
		(screenReader && screenReader.length > 0) ||
		(ariaAttributes && Object.keys(ariaAttributes).length > 0) ||
		focusManagement ||
		(interactiveStates && interactiveStates.length > 0)

	if (!hasContent) {
		return null
	}

	return (
		<div className="my-6 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
				aria-expanded={isOpen}
				aria-controls="accessibility-docs-content"
			>
				<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
					{title}
				</h3>
				<svg
					className={`h-5 w-5 text-zinc-500 transition-transform dark:text-zinc-400 ${
						isOpen ? 'rotate-180' : ''
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					id="accessibility-docs-content"
					className="border-t border-zinc-200 p-4 dark:border-zinc-800"
				>
					<div className="space-y-6">
						{keyboard && keyboard.length > 0 && (
							<div>
								<h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
									Keyboard Navigation
								</h4>
								<ul className="space-y-2">
									{keyboard.map((interaction, index) => (
										<li key={index} className="flex items-start gap-3">
											<kbd className="rounded border border-zinc-300 bg-zinc-100 px-2 py-1 text-xs font-mono font-semibold text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
												{interaction.key}
											</kbd>
											<span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
												{interaction.description}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{screenReader && screenReader.length > 0 && (
							<div>
								<h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
									Screen Reader Announcements
								</h4>
								<ul className="space-y-2">
									{screenReader.map((announcement, index) => (
										<li
											key={index}
											className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
										>
											<span
												className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
												aria-hidden="true"
											/>
											<span className="flex-1 italic">"{announcement}"</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{ariaAttributes && Object.keys(ariaAttributes).length > 0 && (
							<div>
								<h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
									ARIA Attributes
								</h4>
								<div className="space-y-3">
									{Object.entries(ariaAttributes).map(([attr, info]) => (
										<div
											key={attr}
											className="rounded bg-zinc-50 p-3 dark:bg-zinc-800/50"
										>
											<code className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-50">
												{attr}
											</code>
											{info.value && (
												<span className="ml-2 text-xs text-zinc-600 dark:text-zinc-400">
													= "{info.value}"
												</span>
											)}
											<p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
												{info.purpose}
											</p>
										</div>
									))}
								</div>
							</div>
						)}

						{focusManagement && (
							<div>
								<h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
									Focus Management
								</h4>
								<p className="text-sm text-zinc-700 dark:text-zinc-300">
									{focusManagement}
								</p>
							</div>
						)}

						{interactiveStates && interactiveStates.length > 0 && (
							<div>
								<h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
									Interactive States
								</h4>
								<ul className="space-y-2">
									{interactiveStates.map((state, index) => (
										<li key={index} className="flex items-start gap-3">
											<span className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
												{state.state}
											</span>
											<span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
												{state.description}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
