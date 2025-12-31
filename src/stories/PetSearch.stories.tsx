import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { PetSearch } from '../components/PetSearch'
import { mockPets, Pet } from '../data/mockPets'

function PetSearchWrapper({
	initialSearchQuery,
	initialType,
	initialStatus,
}: {
	initialSearchQuery?: string
	initialType?: Pet['type'] | 'all'
	initialStatus?: Pet['adoptionStatus'] | 'all'
}) {
	const [filteredPets, setFilteredPets] = useState(mockPets)

	return (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetSearch
				pets={mockPets}
				onFilterChange={setFilteredPets}
				initialSearchQuery={initialSearchQuery}
				initialType={initialType}
				initialStatus={initialStatus}
			/>
			<div className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
				<p>
					Filtered results: {filteredPets.length} of {mockPets.length} pets
				</p>
			</div>
		</div>
	)
}

const meta = {
	title: 'Pet Adoption/PetSearch',
	component: PetSearchWrapper,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A search and filter component for finding pets. Includes text search, type filters, status filters, and real-time result updates with accessibility support.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		initialSearchQuery: {
			control: 'text',
			description: 'Initial search query value',
			table: {
				type: { summary: 'string' },
				category: 'Props',
			},
		},
		initialType: {
			control: 'select',
			options: ['all', 'dog', 'cat', 'rabbit'],
			description: 'Initial pet type filter selection',
			table: {
				type: { summary: "Pet['type'] | 'all'" },
				category: 'Props',
			},
		},
		initialStatus: {
			control: 'select',
			options: ['all', 'available', 'pending', 'adopted'],
			description: 'Initial adoption status filter selection',
			table: {
				type: { summary: "Pet['adoptionStatus'] | 'all'" },
				category: 'Props',
			},
		},
	},
} satisfies Meta<typeof PetSearchWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The search component in its default state with all filtering options available.',
			},
		},
	},
}

export const AllTypes: Story = {
	render: () => <PetSearchWrapper initialType="all" />,
	parameters: {
		docs: {
			description: {
				story: 'Pet type filter set to "All" - shows all pet types.',
			},
		},
	},
}

export const DogsSelected: Story = {
	render: () => <PetSearchWrapper initialType="dog" />,
	parameters: {
		docs: {
			description: {
				story: 'Pet type filter set to "Dogs" - only shows dogs in results.',
			},
		},
	},
}

export const CatsSelected: Story = {
	render: () => <PetSearchWrapper initialType="cat" />,
	parameters: {
		docs: {
			description: {
				story: 'Pet type filter set to "Cats" - only shows cats in results.',
			},
		},
	},
}

export const RabbitsSelected: Story = {
	render: () => <PetSearchWrapper initialType="rabbit" />,
	parameters: {
		docs: {
			description: {
				story:
					'Pet type filter set to "Rabbits" - only shows rabbits in results.',
			},
		},
	},
}

export const EmptySearch: Story = {
	render: () => <PetSearchWrapper initialSearchQuery="" />,
	parameters: {
		docs: {
			description: {
				story: 'Search input is empty - no search query applied.',
			},
		},
	},
}

export const WithSearchQuery: Story = {
	render: () => <PetSearchWrapper initialSearchQuery="Luna" />,
	parameters: {
		docs: {
			description: {
				story:
					'Search input contains text "Luna" - shows clear button and filters results.',
			},
		},
	},
}

export const LongSearchQuery: Story = {
	render: () => (
		<PetSearchWrapper initialSearchQuery="Golden Retriever friendly energetic" />
	),
	parameters: {
		docs: {
			description: {
				story:
					'Search input contains a longer query - demonstrates text wrapping and search functionality.',
			},
		},
	},
}

export const AllStatuses: Story = {
	render: () => <PetSearchWrapper initialStatus="all" />,
	parameters: {
		docs: {
			description: {
				story:
					'Adoption status filter set to "All Statuses" - shows all adoption statuses.',
			},
		},
	},
}

export const AvailableSelected: Story = {
	render: () => <PetSearchWrapper initialStatus="available" />,
	parameters: {
		docs: {
			description: {
				story:
					'Adoption status filter set to "Available" - only shows pets available for adoption (green badge).',
			},
		},
	},
}

export const PendingSelected: Story = {
	render: () => <PetSearchWrapper initialStatus="pending" />,
	parameters: {
		docs: {
			description: {
				story:
					'Adoption status filter set to "Pending" - only shows pets with pending adoption status (yellow badge).',
			},
		},
	},
}

export const AdoptedSelected: Story = {
	render: () => <PetSearchWrapper initialStatus="adopted" />,
	parameters: {
		docs: {
			description: {
				story:
					'Adoption status filter set to "Adopted" - only shows pets that have been adopted (gray badge).',
			},
		},
	},
}

export const MultipleFilters: Story = {
	render: () => (
		<PetSearchWrapper
			initialSearchQuery="Golden"
			initialType="dog"
			initialStatus="available"
		/>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Multiple filters active - search query "Golden", type "Dogs", and status "Available". Shows active filter count badge and clear filters button.',
			},
		},
	},
}

export const NoResults: Story = {
	args: {
		initialSearchQuery: 'NonExistentPetName12345',
	},

	render: () => (
		<PetSearchWrapper
			initialSearchQuery="NonExistentPetName12345"
			initialType="dog"
			initialStatus="available"
		/>
	),

	parameters: {
		docs: {
			description: {
				story:
					'Filters result in no matches - demonstrates the "No pets found" state with result count showing 0.',
			},
		},
	},
}
