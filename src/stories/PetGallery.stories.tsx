import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'

import { PetGallery } from '../components/PetGallery'
import { mockPets } from '../data/mockPets'

const meta = {
	title: 'Pet Adoption/PetGallery',
	component: PetGallery,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The main gallery component that combines search, filtering, and pet card display. Click any card to view detailed information in a modal.',
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
		initialModalPetId: {
			control: 'select',
			options: ['', ...mockPets.map((p) => p.id)],
			description: 'Initial pet ID to show in modal (opens modal on load)',
			table: {
				type: { summary: 'string' },
				category: 'Props',
			},
		},
	},
} satisfies Meta<typeof PetGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'The complete pet gallery with search functionality, filters, and interactive pet cards in default state.',
			},
		},
	},
}

export const DogsFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialType="dog" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with pet type filter set to "Dogs" - only displays dog cards.',
			},
		},
	},
}

export const CatsFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialType="cat" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with pet type filter set to "Cats" - only displays cat cards.',
			},
		},
	},
}

export const RabbitsFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialType="rabbit" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with pet type filter set to "Rabbits" - only displays rabbit cards.',
			},
		},
	},
}

export const WithSearchQuery: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialSearchQuery="Luna" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with search query "Luna" - shows filtered results matching the search term.',
			},
		},
	},
}

export const WithLongSearchQuery: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialSearchQuery="Golden Retriever friendly" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with a longer search query - demonstrates search functionality with multiple words.',
			},
		},
	},
}

export const AvailableFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialStatus="available" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with adoption status filter set to "Available" - only shows pets available for adoption.',
			},
		},
	},
}

export const PendingFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialStatus="pending" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with adoption status filter set to "Pending" - only shows pets with pending adoption status.',
			},
		},
	},
}

export const AdoptedFilter: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialStatus="adopted" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with adoption status filter set to "Adopted" - only shows pets that have been adopted.',
			},
		},
	},
}

export const MultipleFilters: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery
				initialSearchQuery="Golden"
				initialType="dog"
				initialStatus="available"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with multiple filters active - search query "Golden", type "Dogs", and status "Available".',
			},
		},
	},
}

export const EmptyState: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery
				initialSearchQuery="NonExistentPet12345"
				initialType="dog"
				initialStatus="available"
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery showing empty state when filters result in no matches - displays "No pets found" message.',
			},
		},
	},
}

export const SinglePetResult: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialSearchQuery="Thumper" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with a single pet result - demonstrates layout with one card.',
			},
		},
	},
}

export const WithModalOpen: Story = {
	render: () => (
		<div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
			<PetGallery initialModalPetId="1" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Gallery with modal open - shows detailed pet information in a modal dialog.',
			},
		},
	},
}
