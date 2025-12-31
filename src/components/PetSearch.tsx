'use client'

import { useState, useRef, useEffect } from 'react'
import { Pet } from '../data/mockPets'

export interface PetSearchProps {
	pets: Pet[]
	onFilterChange: (filteredPets: Pet[]) => void
	initialSearchQuery?: string
	initialType?: Pet['type'] | 'all'
	initialStatus?: Pet['adoptionStatus'] | 'all'
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

export function PetSearch({
	pets,
	onFilterChange,
	initialSearchQuery = '',
	initialType = 'all',
	initialStatus = 'all',
}: PetSearchProps) {
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
	const [selectedType, setSelectedType] = useState<Pet['type'] | 'all'>(
		initialType
	)
	const [selectedStatus, setSelectedStatus] = useState<
		Pet['adoptionStatus'] | 'all'
	>(initialStatus)
	const [resultCount, setResultCount] = useState(pets.length)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const resultsAnnouncementRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const filtered = pets.filter((pet) => {
			const matchesSearch =
				searchQuery === '' ||
				pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pet.shelterLocation.toLowerCase().includes(searchQuery.toLowerCase())

			const matchesType = selectedType === 'all' || pet.type === selectedType
			const matchesStatus =
				selectedStatus === 'all' || pet.adoptionStatus === selectedStatus

			return matchesSearch && matchesType && matchesStatus
		})

		onFilterChange(filtered)
		setResultCount(filtered.length)
	}, [searchQuery, selectedType, selectedStatus, pets, onFilterChange])

	useEffect(() => {
		if (resultsAnnouncementRef.current) {
			const message =
				resultCount === 0
					? 'No pets found matching your search criteria'
					: `${resultCount} ${resultCount === 1 ? 'pet' : 'pets'} found`
			resultsAnnouncementRef.current.textContent = message
		}
	}, [resultCount])

	function handleClearSearch() {
		setSearchQuery('')
		setSelectedType('all')
		setSelectedStatus('all')
		searchInputRef.current?.focus()
	}

	function handleKeyDown(e: React.KeyboardEvent, action: () => void) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			action()
		}
	}

	const hasActiveFilters =
		searchQuery !== '' || selectedType !== 'all' || selectedStatus !== 'all'

	const activeFilterCount =
		(searchQuery !== '' ? 1 : 0) +
		(selectedType !== 'all' ? 1 : 0) +
		(selectedStatus !== 'all' ? 1 : 0)

	return (
		<div className="mb-10 w-full">
			<div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
				<h2 className="sr-only">Search and filter pets</h2>

				<div className="mb-6">
					<label
						htmlFor="pet-search-input"
						className="mb-3 block text-base font-semibold text-zinc-900 dark:text-zinc-50"
					>
						Search Pets
					</label>
					<div className="relative">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
							<svg
								className="h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							ref={searchInputRef}
							id="pet-search-input"
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by name, breed, description, or location..."
							className="group block w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 py-3.5 pl-12 pr-12 text-base text-zinc-900 placeholder-zinc-400 transition-all focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-200/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-800 dark:focus:ring-zinc-700/50"
							aria-label="Search pets by name, breed, description, or location"
							aria-describedby="search-description"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => {
									setSearchQuery('')
									searchInputRef.current?.focus()
								}}
								className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 transition-colors hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:hover:text-zinc-200 dark:focus:ring-zinc-400"
								aria-label="Clear search"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
					<p id="search-description" className="sr-only">
						Enter keywords to search pets by name, breed, description, or
						shelter location
					</p>
				</div>

				<div className="space-y-5">
					<div>
						<label className="mb-3 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
							Pet Type
						</label>
						<div
							className="flex flex-wrap gap-2"
							role="group"
							aria-label="Filter by pet type"
						>
							<button
								type="button"
								onClick={() => setSelectedType('all')}
								className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
									selectedType === 'all'
										? 'border-zinc-400 bg-zinc-100 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50'
										: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
								} focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-zinc-400`}
								aria-pressed={selectedType === 'all'}
							>
								<span>All</span>
							</button>
							{(['dog', 'cat', 'rabbit'] as const).map((type) => (
								<button
									key={type}
									type="button"
									onClick={() => setSelectedType(type)}
									className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
										selectedType === type
											? 'border-zinc-400 bg-zinc-100 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50'
											: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
									} focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-zinc-400`}
									aria-pressed={selectedType === type}
								>
									<span className="text-base" aria-hidden="true">
										{getTypeIcon(type)}
									</span>
									<span className="capitalize">{type}s</span>
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="mb-3 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
							Adoption Status
						</label>
						<div
							className="flex flex-wrap gap-2"
							role="group"
							aria-label="Filter by adoption status"
						>
							<button
								type="button"
								onClick={() => setSelectedStatus('all')}
								className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
									selectedStatus === 'all'
										? 'border-zinc-400 bg-zinc-100 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50'
										: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
								} focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-zinc-400`}
								aria-pressed={selectedStatus === 'all'}
							>
								All Statuses
							</button>
							{(['available', 'pending', 'adopted'] as const).map((status) => {
								const statusColors = {
									available:
										'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300',
									pending:
										'border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
									adopted:
										'border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
								}
								return (
									<button
										key={status}
										type="button"
										onClick={() => setSelectedStatus(status)}
										className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium capitalize transition-all ${
											selectedStatus === status
												? `${statusColors[status]} shadow-sm`
												: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
										} focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-zinc-400`}
										aria-pressed={selectedStatus === status}
									>
										{status}
									</button>
								)
							})}
						</div>
					</div>
				</div>

				<div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:items-center">
					<div className="flex items-center gap-3">
						<div
							ref={resultsAnnouncementRef}
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							role="status"
							aria-live="polite"
							aria-atomic="true"
						>
							<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
								{resultCount}
							</span>{' '}
							<span className="text-zinc-600 dark:text-zinc-400">
								{resultCount === 1 ? 'pet' : 'pets'} found
							</span>
						</div>
						{hasActiveFilters && (
							<span
								className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
								aria-label={`${activeFilterCount} active filter${
									activeFilterCount === 1 ? '' : 's'
								}`}
							>
								{activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'}
							</span>
						)}
					</div>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={handleClearSearch}
							onKeyDown={(e) => handleKeyDown(e, handleClearSearch)}
							className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 dark:focus:ring-zinc-400"
							aria-label="Clear all search filters"
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							Clear Filters
						</button>
					)}
				</div>

				{!hasActiveFilters && (
					<div
						ref={resultsAnnouncementRef}
						className="sr-only"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					/>
				)}
			</div>
		</div>
	)
}
