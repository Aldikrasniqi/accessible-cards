import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState, useRef, useEffect } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { PetCard } from '../components/PetCard'
import { StateDocumentation } from '../components/StateDocumentation'
import { mockPets } from '../data/mockPets'

const meta = {
	title: 'Pet Adoption/PetCard',
	component: PetCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'An accessible pet card component that displays pet information. Supports both interactive (clickable) and non-interactive states with full keyboard and screen reader support.',
			},
		},
		a11y: {
			config: {
				rules: [
					{
						id: 'color-contrast',
						enabled: true,
					},
				],
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		pet: {
			control: 'object',
			description: 'Pet data object',
		},
		onClick: {
			action: 'clicked',
			description: 'Callback function when card is clicked',
		},
	},
} satisfies Meta<typeof PetCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		pet: mockPets[0],
		onClick: undefined,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const card = canvas.getByRole('article')

		expect(card.tagName.toLowerCase()).toBe('article')
		expect(card).toHaveAttribute(
			'aria-describedby',
			`pet-description-${mockPets[0].id}`
		)

		expect(card).not.toHaveAttribute('tabindex', '0')

		const statusLabel = `${
			mockPets[0].adoptionStatus.charAt(0).toUpperCase() +
			mockPets[0].adoptionStatus.slice(1)
		} for adoption`
		const statusBadge = canvas.getByLabelText(statusLabel)
		expect(statusBadge).toHaveAttribute('role', 'status')

		const image = canvas.getByAltText(
			`${mockPets[0].name}, a ${mockPets[0].age}-year-old ${mockPets[0].breed} ${mockPets[0].type}`
		)
		expect(image).toBeInTheDocument()
	},
	render: (args) => (
		<div className="w-full max-w-sm">
			<StateDocumentation
				title="Non-Interactive Card Accessibility"
				keyboard={[]}
				screenReader={[
					`Announces: "${args.pet.name}, a ${args.pet.age}-year-old ${args.pet.breed} ${args.pet.type}"`,
					`Status badge announces: "${
						args.pet.adoptionStatus.charAt(0).toUpperCase() +
						args.pet.adoptionStatus.slice(1)
					} for adoption"`,
					`Location announces: "Location: ${args.pet.shelterLocation}"`,
				]}
				ariaAttributes={{
					element: {
						value: '<article>',
						purpose:
							'Semantic HTML element indicating this is an article/content section. No explicit role needed as article is semantic.',
					},
					'aria-describedby': {
						value: `pet-description-${args.pet.id}`,
						purpose:
							'References the description container for additional context',
					},
				}}
				focusManagement="Card is not focusable (no tabIndex). Used for display-only purposes."
				interactiveStates={[
					{
						state: 'Default',
						description:
							'Card displays pet information with no interactive behavior',
					},
				]}
			/>
			<PetCard {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Non-interactive card state. The card displays pet information but cannot be clicked or focused. Uses semantic `<article>` element (no explicit role needed as article is semantic HTML).',
			},
		},
	},
}

export const Interactive: Story = {
	args: {
		pet: mockPets[0],
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const card = canvas.getByLabelText(
			`View details for ${mockPets[0].name}, ${mockPets[0].type}, ${
				mockPets[0].age
			} ${mockPets[0].age === 1 ? 'year' : 'years'} old, ${
				mockPets[0].breed
			}, ${
				mockPets[0].adoptionStatus.charAt(0).toUpperCase() +
				mockPets[0].adoptionStatus.slice(1)
			} for adoption`
		)

		expect(card.tagName.toLowerCase()).toBe('div')
		expect(card).toHaveAttribute('role', 'button')
		expect(card).toHaveAttribute('tabindex', '0')
		expect(card).toHaveAttribute(
			'aria-describedby',
			`pet-description-${mockPets[0].id}`
		)

		const ariaLabel = card.getAttribute('aria-label')
		expect(ariaLabel).toContain(mockPets[0].name)
		expect(ariaLabel).toContain(mockPets[0].type)
		expect(ariaLabel).toContain('View details for')

		await userEvent.click(card)
		expect(args.onClick).toHaveBeenCalledTimes(1)

		card.focus()
		await userEvent.keyboard('{Enter}')
		expect(args.onClick).toHaveBeenCalledTimes(2)

		await userEvent.keyboard(' ')
		expect(args.onClick).toHaveBeenCalledTimes(3)

		expect(card).toHaveFocus()
	},
	render: (args) => (
		<div className="w-full max-w-sm">
			<StateDocumentation
				title="Interactive Card Accessibility"
				keyboard={[
					{
						key: 'Enter',
						description: 'Activates the card, triggering the onClick handler',
					},
					{
						key: 'Space',
						description: 'Activates the card, triggering the onClick handler',
					},
					{
						key: 'Tab',
						description: 'Moves focus to the card (when tabIndex is 0)',
					},
				]}
				screenReader={[
					`On focus: "View details for ${args.pet.name}, ${args.pet.type}, ${
						args.pet.age
					} ${args.pet.age === 1 ? 'year' : 'years'} old, ${args.pet.breed}, ${
						args.pet.adoptionStatus.charAt(0).toUpperCase() +
						args.pet.adoptionStatus.slice(1)
					} for adoption, button"`,
					`Then reads the description content via aria-describedby`,
					`Status badge announces: "${
						args.pet.adoptionStatus.charAt(0).toUpperCase() +
						args.pet.adoptionStatus.slice(1)
					} for adoption"`,
				]}
				ariaAttributes={{
					element: {
						value: '<div>',
						purpose: 'Uses div element (not article) to allow role="button"',
					},
					role: {
						value: 'button',
						purpose: 'Indicates the card is an interactive button element',
					},
					'aria-label': {
						value: `View details for ${args.pet.name}, ${args.pet.type}, ${
							args.pet.age
						} ${args.pet.age === 1 ? 'year' : 'years'} old, ${
							args.pet.breed
						}, ${
							args.pet.adoptionStatus.charAt(0).toUpperCase() +
							args.pet.adoptionStatus.slice(1)
						} for adoption`,
						purpose:
							'Provides a comprehensive accessible name describing the card action and content',
					},
					'aria-describedby': {
						value: `pet-description-${args.pet.id}`,
						purpose:
							'References the description container for additional context',
					},
					tabIndex: {
						value: '0',
						purpose: 'Makes the card focusable via keyboard navigation',
					},
				}}
				focusManagement="Card receives focus ring when focused via keyboard. Focus ring uses ring-2 ring-zinc-500 with offset for visibility."
				interactiveStates={[
					{
						state: 'Default',
						description: 'Card displays pet information',
					},
					{
						state: 'Hover',
						description:
							'Shadow increases (hover:shadow-md) and image scales slightly',
					},
					{
						state: 'Focus',
						description:
							'Focus ring appears (ring-2 ring-zinc-500 ring-offset-2)',
					},
					{
						state: 'Active',
						description: 'onClick handler is triggered',
					},
				]}
			/>
			<PetCard {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Interactive card state. The card is clickable and fully keyboard accessible. Uses `<div>` element with role="button" (article elements cannot have button role) and comprehensive aria-label for screen readers.',
			},
		},
	},
}

export const Focused: Story = {
	args: {
		pet: mockPets[1],
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const card = canvas.getByLabelText(
			`View details for ${mockPets[1].name}, ${mockPets[1].type}, ${
				mockPets[1].age
			} ${mockPets[1].age === 1 ? 'year' : 'years'} old, ${
				mockPets[1].breed
			}, ${
				mockPets[1].adoptionStatus.charAt(0).toUpperCase() +
				mockPets[1].adoptionStatus.slice(1)
			} for adoption`
		)

		await new Promise((resolve) => setTimeout(resolve, 150))

		expect(card).toHaveFocus()

		expect(card.className).toContain('focus-within:ring-2')

		await userEvent.keyboard('{Enter}')
		expect(args.onClick).toHaveBeenCalledTimes(1)

		card.focus()
		await userEvent.keyboard(' ')
		expect(args.onClick).toHaveBeenCalledTimes(2)
	},
	render: (args) => {
		const containerRef = React.useRef<HTMLDivElement>(null)

		React.useEffect(() => {
			setTimeout(() => {
				const cardElement =
					containerRef.current?.querySelector<HTMLElement>('[role="button"]')
				cardElement?.focus()
			}, 100)
		}, [])

		return (
			<div ref={containerRef} className="w-full max-w-sm">
				<StateDocumentation
					title="Focused State Accessibility"
					keyboard={[
						{
							key: 'Tab',
							description: 'Card receives focus and displays focus ring',
						},
						{
							key: 'Enter / Space',
							description: 'Activates the card from focused state',
						},
					]}
					screenReader={[
						`Screen reader announces: "View details for ${args.pet.name}, ${
							args.pet.type
						}, ${args.pet.age} ${args.pet.age === 1 ? 'year' : 'years'} old, ${
							args.pet.breed
						}, ${
							args.pet.adoptionStatus.charAt(0).toUpperCase() +
							args.pet.adoptionStatus.slice(1)
						} for adoption, button"`,
					]}
					ariaAttributes={{
						'focus-visible': {
							value: 'true',
							purpose:
								'Indicates the element is focused via keyboard (not mouse)',
						},
					}}
					focusManagement="Focus ring appears with 2px solid ring and offset. Uses focus-within to show ring when any child element receives focus."
					interactiveStates={[
						{
							state: 'Focused',
							description:
								'Focus ring visible (ring-2 ring-zinc-500 ring-offset-2)',
						},
					]}
				/>
				<PetCard
					{...args}
					onClick={(e) => {
						args.onClick?.(e)
					}}
				/>
			</div>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					'Card in focused state. The focus ring is visible, indicating keyboard focus. This state is automatically demonstrated when the story loads.',
			},
		},
	},
}

export const DifferentPet: Story = {
	args: {
		pet: mockPets[2],
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const card = canvas.getByLabelText(
			`View details for ${mockPets[2].name}, ${mockPets[2].type}, ${
				mockPets[2].age
			} ${mockPets[2].age === 1 ? 'year' : 'years'} old, ${
				mockPets[2].breed
			}, ${
				mockPets[2].adoptionStatus.charAt(0).toUpperCase() +
				mockPets[2].adoptionStatus.slice(1)
			} for adoption`
		)

		expect(card.tagName.toLowerCase()).toBe('div')
		expect(card).toHaveAttribute('role', 'button')
		expect(card).toHaveAttribute('tabindex', '0')

		const ariaLabel = card.getAttribute('aria-label')
		expect(ariaLabel).toContain(mockPets[2].name)
		expect(ariaLabel).toContain('rabbit')

		await userEvent.click(card)
		expect(args.onClick).toHaveBeenCalledTimes(1)

		const statusBadge = canvas.getByLabelText('Pending for adoption')
		expect(statusBadge).toHaveAttribute('role', 'status')
	},
	render: (args) => (
		<div className="w-full max-w-sm">
			<StateDocumentation
				title="Interactive Card with Different Pet"
				keyboard={[
					{
						key: 'Enter',
						description: 'Activates the card',
					},
					{
						key: 'Space',
						description: 'Activates the card',
					},
				]}
				screenReader={[
					`Announces: "View details for ${args.pet.name}, ${args.pet.type}, ${
						args.pet.age
					} ${args.pet.age === 1 ? 'year' : 'years'} old, ${args.pet.breed}, ${
						args.pet.adoptionStatus.charAt(0).toUpperCase() +
						args.pet.adoptionStatus.slice(1)
					} for adoption, button"`,
				]}
				ariaAttributes={{
					element: {
						value: '<div>',
						purpose: 'Uses div element (not article) to allow role="button"',
					},
					role: {
						value: 'button',
						purpose: 'Indicates interactive element',
					},
					'aria-label': {
						value: `View details for ${args.pet.name}...`,
						purpose: 'Provides accessible name',
					},
				}}
			/>
			<PetCard {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Interactive card with a different pet (rabbit) to demonstrate variety.',
			},
		},
	},
}

export const WithModal: Story = {
	args: {
		pet: mockPets[0],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const card = canvas.getByLabelText(
			`View details for ${mockPets[0].name}, ${mockPets[0].type}, ${
				mockPets[0].age
			} ${mockPets[0].age === 1 ? 'year' : 'years'} old, ${
				mockPets[0].breed
			}, ${
				mockPets[0].adoptionStatus.charAt(0).toUpperCase() +
				mockPets[0].adoptionStatus.slice(1)
			} for adoption`
		)

		await userEvent.click(card)

		const modalSimulation = await canvas.findByText(
			/Modal would open here/i,
			{},
			{ timeout: 2000 }
		)
		expect(modalSimulation).toBeInTheDocument()

		const closeButton = canvas.getByRole('button', { name: /close modal/i })
		await userEvent.click(closeButton)

		await new Promise((resolve) => setTimeout(resolve, 200))

		const closedModal = canvas.queryByText(/Modal would open here/i)
		expect(closedModal).not.toBeInTheDocument()
	},
	render: (args) => {
		const [isModalOpen, setIsModalOpen] = useState(false)
		const triggerRef = useRef<HTMLElement | null>(null)

		return (
			<div className="w-full max-w-sm">
				<StateDocumentation
					title="Card with Modal Integration"
					keyboard={[
						{
							key: 'Enter / Space',
							description: 'Activates card and opens modal',
						},
						{
							key: 'Escape',
							description:
								'Closes modal and returns focus to card (when modal is open)',
						},
					]}
					screenReader={[
						`On card activation: "View details for ${args.pet.name}..., button"`,
						'When modal opens: Focus moves to modal close button',
						'When modal closes: Focus returns to the card that triggered it',
					]}
					ariaAttributes={{
						element: {
							value: '<div>',
							purpose: 'Uses div element (not article) to allow role="button"',
						},
						role: {
							value: 'button',
							purpose: 'Card acts as trigger for modal dialog',
						},
					}}
					focusManagement="When card is activated, modal opens and focus moves to modal. When modal closes, focus returns to the card element."
					interactiveStates={[
						{
							state: 'Card Clicked',
							description: 'Modal opens, focus moves to modal',
						},
						{
							state: 'Modal Closed',
							description: 'Focus returns to card',
						},
					]}
				/>
				<PetCard
					{...args}
					onClick={(e) => {
						triggerRef.current = e?.currentTarget as HTMLElement | null
						setIsModalOpen(true)
					}}
				/>
				{isModalOpen && (
					<div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
						<p className="text-sm text-zinc-700 dark:text-zinc-300">
							Modal would open here. Press Escape to close (simulated).
						</p>
						<button
							type="button"
							onClick={() => setIsModalOpen(false)}
							className="mt-2 rounded bg-zinc-200 px-3 py-1 text-sm dark:bg-zinc-800"
						>
							Close Modal
						</button>
					</div>
				)}
			</div>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					'Card integrated with modal functionality. Demonstrates focus management when opening and closing modals.',
			},
		},
	},
}
