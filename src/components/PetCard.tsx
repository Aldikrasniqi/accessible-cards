import Image from 'next/image'
import { Pet } from '../data/mockPets'

export interface PetCardProps {
	pet: Pet
	onClick?: (e?: React.MouseEvent<HTMLElement>) => void
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

export function PetCard({ pet, onClick }: PetCardProps) {
	const cardId = `pet-card-${pet.id}`
	const descriptionId = `pet-description-${pet.id}`
	const statusLabel = `${
		pet.adoptionStatus.charAt(0).toUpperCase() + pet.adoptionStatus.slice(1)
	} for adoption`

	function handleKeyDown(e: React.KeyboardEvent) {
		if (onClick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault()
			onClick()
		}
	}

	function handleClick(e: React.MouseEvent<HTMLElement>) {
		if (onClick) {
			onClick(e)
		}
	}

	const cardClassName =
		'group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-zinc-500 focus-within:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-zinc-400'

	const cardContent = (
		<>
			<div className="relative h-64 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
				<Image
					src={pet.imageUrl}
					alt={`${pet.name}, a ${pet.age}-year-old ${pet.breed} ${pet.type}`}
					fill
					className="object-cover transition-transform group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<div className="absolute right-2 top-2">
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
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
			</div>

			<div className="flex flex-1 flex-col p-5" id={descriptionId}>
				<div className="mb-2 flex items-start justify-between">
					<div className="flex-1">
						<h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
							{pet.name}
						</h3>
						<div className="mt-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
							<span aria-hidden="true">{getTypeIcon(pet.type)}</span>
							<span className="capitalize">{pet.type}</span>
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
						</div>
					</div>
				</div>

				<div className="mb-3">
					<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
						{pet.breed}
					</p>
				</div>

				<p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
					{pet.description}
				</p>

				<div className="mt-auto border-t border-zinc-200 pt-3 dark:border-zinc-800">
					<p className="text-xs text-zinc-600 dark:text-zinc-400">
						<span aria-hidden="true">📍</span>
						<span className="sr-only">Location: </span>
						{pet.shelterLocation}
					</p>
				</div>
			</div>
		</>
	)

	if (onClick) {
		return (
			<div
				className={cardClassName}
				id={cardId}
				role="button"
				tabIndex={0}
				aria-label={`View details for ${pet.name}, ${pet.type}, ${pet.age} ${
					pet.age === 1 ? 'year' : 'years'
				} old, ${pet.breed}, ${statusLabel}`}
				aria-describedby={descriptionId}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				{cardContent}
			</div>
		)
	}

	return (
		<article
			className={cardClassName}
			id={cardId}
			aria-describedby={descriptionId}
		>
			{cardContent}
		</article>
	)
}
