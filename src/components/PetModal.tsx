'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Pet } from '../data/mockPets'

export interface PetModalProps {
	pet: Pet | null
	isOpen: boolean
	onClose: () => void
	triggerElement?: HTMLElement | null
}

function getStatusColor(status: Pet['adoptionStatus']): string {
	switch (status) {
		case 'available':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
		case 'pending':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
		case 'adopted':
			return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
	}
}

function getTypeIcon(type: Pet['type']): string {
	switch (type) {
		case 'dog':
			return '🐕'
		case 'cat':
			return '🐱'
		case 'rabbit':
			return '🐰'
		default:
			return '🐾'
	}
}

export function PetModal({
	pet,
	isOpen,
	onClose,
	triggerElement,
}: PetModalProps) {
	const modalRef = useRef<HTMLDivElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const previousActiveElementRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		if (isOpen) {
			previousActiveElementRef.current = document.activeElement as HTMLElement
			document.body.style.overflow = 'hidden'
			setTimeout(() => {
				closeButtonRef.current?.focus()
			}, 0)
		} else {
			document.body.style.overflow = ''
			if (triggerElement) {
				triggerElement.focus()
			} else if (previousActiveElementRef.current) {
				previousActiveElementRef.current.focus()
			}
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen, triggerElement])

	useEffect(() => {
		function handleEscape(e: KeyboardEvent) {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	useEffect(() => {
		if (!isOpen || !modalRef.current) return

		function handleTabKey(e: KeyboardEvent) {
			if (e.key !== 'Tab') return

			const modal = modalRef.current
			if (!modal) return

			const focusableElements = modal.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			const firstElement = focusableElements[0]
			const lastElement = focusableElements[focusableElements.length - 1]

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					e.preventDefault()
					lastElement?.focus()
				}
			} else {
				if (document.activeElement === lastElement) {
					e.preventDefault()
					firstElement?.focus()
				}
			}
		}

		document.addEventListener('keydown', handleTabKey)
		return () => document.removeEventListener('keydown', handleTabKey)
	}, [isOpen])

	function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget || (e.target as HTMLElement).getAttribute('aria-hidden') === 'true') {
			onClose()
		}
	}

	if (!isOpen || !pet) {
		return null
	}

	const statusLabel = `${
		pet.adoptionStatus.charAt(0).toUpperCase() + pet.adoptionStatus.slice(1)
	} for adoption`
	const modalDescriptionId = `pet-modal-description-${pet.id}`

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="pet-modal-title"
			aria-describedby={modalDescriptionId}
		>
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				aria-hidden="true"
			/>
			<div
				ref={modalRef}
				className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900 focus:outline-none"
				tabIndex={-1}
			>
				<div className="flex flex-col md:flex-row">
					<div className="relative h-64 w-full md:h-auto md:w-1/2 bg-zinc-100 dark:bg-zinc-800">
						<Image
							src={pet.imageUrl}
							alt={`${pet.name}, a ${pet.age}-year-old ${pet.breed} ${pet.type}`}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>

					<div
						className="flex flex-1 flex-col p-6 md:p-8 overflow-y-auto"
						id={modalDescriptionId}
					>
						<div className="mb-4 flex items-start justify-between">
							<div className="flex-1">
								<h2
									id="pet-modal-title"
									className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
								>
									{pet.name}
								</h2>
								<div className="mt-2 flex flex-wrap items-center gap-3 text-base text-zinc-600 dark:text-zinc-400">
									<span className="flex items-center gap-1.5">
										<span className="text-xl" aria-hidden="true">
											{getTypeIcon(pet.type)}
										</span>
										<span className="capitalize font-medium">{pet.type}</span>
									</span>
									<span className="sr-only">,</span>
									<span
										className="text-zinc-400 dark:text-zinc-500"
										aria-hidden="true"
									>
										•
									</span>
									<span>
										{pet.age} {pet.age === 1 ? 'year' : 'years'} old
									</span>
									<span className="sr-only">,</span>
									<span
										className="text-zinc-400 dark:text-zinc-500"
										aria-hidden="true"
									>
										•
									</span>
									<span className="font-medium">{pet.breed}</span>
								</div>
							</div>
							<button
								ref={closeButtonRef}
								onClick={onClose}
								className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:ring-zinc-400"
								aria-label={`Close ${pet.name} details modal`}
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="mb-4">
							<span
								className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
									pet.adoptionStatus
								)}`}
								aria-label={statusLabel}
								role="status"
							>
								<span aria-hidden="true">
									{pet.adoptionStatus.charAt(0).toUpperCase() +
										pet.adoptionStatus.slice(1)}
								</span>
							</span>
						</div>

						<div className="mb-6">
							<h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
								About
							</h3>
							<p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
								{pet.description}
							</p>
						</div>

						<div className="mt-auto space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
							<div>
								<h4 className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
									Shelter Location
								</h4>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									<span aria-hidden="true">📍</span>
									<span className="sr-only">Location: </span>
									{pet.shelterLocation}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
