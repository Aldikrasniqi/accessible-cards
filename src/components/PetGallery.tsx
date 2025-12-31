'use client'

import { useState, useRef, useCallback } from 'react'
import { PetCard } from './PetCard'
import { PetModal } from './PetModal'
import { PetSearch } from './PetSearch'
import { mockPets, Pet } from '../data/mockPets'

export interface PetGalleryProps {
	initialSearchQuery?: string
	initialType?: Pet['type'] | 'all'
	initialStatus?: Pet['adoptionStatus'] | 'all'
	initialModalPetId?: string
}

export function PetGallery({
	initialSearchQuery,
	initialType,
	initialStatus,
	initialModalPetId,
}: PetGalleryProps = {}) {
	const initialPet = initialModalPetId
		? mockPets.find((p) => p.id === initialModalPetId) || null
		: null
	const [selectedPet, setSelectedPet] = useState<Pet | null>(initialPet)
	const [isModalOpen, setIsModalOpen] = useState(!!initialPet)
	const [filteredPets, setFilteredPets] = useState<Pet[]>(mockPets)
	const triggerElementRef = useRef<HTMLElement | null>(null)

	function handlePetClick(pet: Pet, element: HTMLElement) {
		triggerElementRef.current = element
		setSelectedPet(pet)
		setIsModalOpen(true)
	}

	function handleCloseModal() {
		setIsModalOpen(false)
		setSelectedPet(null)
		triggerElementRef.current = null
	}

	const handleFilterChange = useCallback((filtered: Pet[]) => {
		setFilteredPets(filtered)
	}, [])

	return (
		<div className="w-full">
			<header className="mb-8 text-center">
				<h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
					Pet Adoption Gallery
				</h1>
				<p className="text-lg text-zinc-600 dark:text-zinc-400">
					Find your perfect companion
				</p>
			</header>

			<PetSearch
				pets={mockPets}
				onFilterChange={handleFilterChange}
				initialSearchQuery={initialSearchQuery}
				initialType={initialType}
				initialStatus={initialStatus}
			/>

			<section aria-label="Available pets for adoption">
				{filteredPets.length > 0 ? (
					<div
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
						role="list"
						aria-label={`${filteredPets.length} ${
							filteredPets.length === 1 ? 'pet' : 'pets'
						} found`}
					>
						{filteredPets.map((pet) => (
							<div key={pet.id} role="listitem">
								<PetCard
									pet={pet}
									onClick={(e) => {
										const target = e?.currentTarget as HTMLElement
										handlePetClick(pet, target)
									}}
								/>
							</div>
						))}
					</div>
				) : (
					<div
						className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900"
						role="status"
						aria-live="polite"
					>
						<p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
							No pets found
						</p>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
							Try adjusting your search or filter criteria
						</p>
					</div>
				)}
			</section>

			<PetModal
				pet={selectedPet}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				triggerElement={triggerElementRef.current}
			/>
		</div>
	)
}
