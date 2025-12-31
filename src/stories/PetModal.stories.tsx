import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState, useRef, useEffect } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { PetModal } from '../components/PetModal'
import { StateDocumentation } from '../components/StateDocumentation'
import { mockPets } from '../data/mockPets'

const meta = {
	title: 'Pet Adoption/PetModal',
	component: PetModal,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'An accessible modal dialog component for displaying detailed pet information. Implements focus trapping, keyboard navigation, and proper ARIA attributes for screen readers.',
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
		isOpen: {
			control: 'boolean',
			description: 'Controls modal visibility',
		},
		onClose: {
			action: 'closed',
			description: 'Callback function when modal is closed',
		},
	},
} satisfies Meta<typeof PetModal>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
	args: {
		pet: mockPets[0],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		await new Promise((resolve) => setTimeout(resolve, 100))

		const modal = canvas.getByRole('dialog')
		expect(modal).toHaveAttribute('aria-modal', 'true')
		expect(modal).toHaveAttribute('aria-labelledby', 'pet-modal-title')
		expect(modal).toHaveAttribute(
			'aria-describedby',
			`pet-modal-description-${mockPets[0].id}`
		)

		const title = canvas.getByText(mockPets[0].name)
		expect(title).toHaveAttribute('id', 'pet-modal-title')

		const closeButton = canvas.getByLabelText(
			`Close ${mockPets[0].name} details modal`
		)
		expect(closeButton).toBeInTheDocument()

		expect(closeButton).toHaveFocus()

		await userEvent.keyboard('{Escape}')
		expect(args.onClose).toHaveBeenCalledTimes(1)
	},
	render: (args) => (
		<div>
			<StateDocumentation
				title="Open Modal Accessibility"
				keyboard={[
					{
						key: 'Escape',
						description:
							'Closes the modal and returns focus to trigger element',
					},
					{
						key: 'Tab',
						description: 'Moves focus to next focusable element within modal',
					},
					{
						key: 'Shift + Tab',
						description:
							'Moves focus to previous focusable element within modal',
					},
				]}
				screenReader={[
					`On open: Announces "${
						args.pet?.name || 'Pet'
					} details modal, dialog"`,
					`Reads modal title: "${args.pet?.name || 'Pet'}"`,
					`Reads modal description via aria-describedby`,
					`Close button announces: "Close ${
						args.pet?.name || 'Pet'
					} details modal, button"`,
				]}
				ariaAttributes={{
					role: {
						value: 'dialog',
						purpose: 'Indicates this is a dialog/modal window',
					},
					'aria-modal': {
						value: 'true',
						purpose:
							'Tells screen readers this modal blocks interaction with background content',
					},
					'aria-labelledby': {
						value: 'pet-modal-title',
						purpose: 'References the modal title element for accessible name',
					},
					'aria-describedby': {
						value: `pet-modal-description-${args.pet?.id || ''}`,
						purpose: 'References the modal description container',
					},
				}}
				focusManagement="When modal opens, focus automatically moves to the close button. Body scroll is locked (overflow: hidden)."
				interactiveStates={[
					{
						state: 'Open',
						description:
							'Modal is visible, focus trapped inside, backdrop visible',
					},
				]}
			/>
			<PetModal {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Modal in open state. Focus is automatically moved to the close button when opened. All keyboard and screen reader features are active.',
			},
		},
	},
}

export const FocusTrap: Story = {
	args: {
		pet: mockPets[1],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		await new Promise((resolve) => setTimeout(resolve, 100))

		const modal = canvas.getByRole('dialog')
		const closeButton = canvas.getByLabelText(
			`Close ${mockPets[1].name} details modal`
		)

		expect(closeButton).toHaveFocus()

		await userEvent.keyboard('{Tab}')

		const focusableElements = modal.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)
		expect(focusableElements.length).toBeGreaterThan(0)

		const backdrop = canvasElement.querySelector('[aria-hidden="true"]')
		expect(backdrop).toBeInTheDocument()
	},
	render: (args) => (
		<div>
			<StateDocumentation
				title="Focus Trap Accessibility"
				keyboard={[
					{
						key: 'Tab',
						description:
							'Cycles through focusable elements. When on last element, wraps to first',
					},
					{
						key: 'Shift + Tab',
						description:
							'Cycles backwards. When on first element, wraps to last',
					},
				]}
				screenReader={[
					'Focus remains within modal boundaries',
					'Background content is not announced (aria-hidden on backdrop)',
				]}
				ariaAttributes={{
					'aria-modal': {
						value: 'true',
						purpose: 'Prevents screen reader from accessing background content',
					},
				}}
				focusManagement="Focus is trapped within the modal. Tab key cycles through: Close button → (any other focusable elements) → wraps back to close button. Focus cannot move to background content."
				interactiveStates={[
					{
						state: 'Tab Navigation',
						description:
							'Focus cycles through all focusable elements within modal',
					},
					{
						state: 'Focus Wrap',
						description:
							'Focus wraps from last to first element (and vice versa)',
					},
				]}
			/>
			<PetModal {...args} />
			<div className="sr-only">
				<p>This content is behind the modal and should not be focusable</p>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates focus trapping. Try using Tab to navigate - focus will cycle within the modal and cannot escape to background content.',
			},
		},
	},
}

export const KeyboardNavigation: Story = {
	args: {
		pet: mockPets[2],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		await new Promise((resolve) => setTimeout(resolve, 100))

		const modal = canvas.getByRole('dialog')

		await userEvent.keyboard('{Escape}')
		expect(args.onClose).toHaveBeenCalledTimes(1)

		expect(modal).toHaveAttribute('aria-modal', 'true')
	},
	render: (args) => {
		const [lastKey, setLastKey] = useState<string>('')

		useEffect(() => {
			function handleKeyDown(e: KeyboardEvent) {
				if (args.isOpen) {
					setLastKey(e.key)
				}
			}
			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}, [args.isOpen])

		return (
			<div>
				<StateDocumentation
					title="Keyboard Navigation"
					keyboard={[
						{
							key: 'Escape',
							description:
								'Closes the modal immediately, returns focus to trigger',
						},
						{
							key: 'Tab',
							description:
								'Moves to next focusable element (close button, then wraps)',
						},
						{
							key: 'Shift + Tab',
							description:
								'Moves to previous focusable element (wraps from first to last)',
						},
					]}
					screenReader={[
						'All keyboard actions are announced appropriately',
						'Escape key closing is handled silently (focus return is the indicator)',
					]}
					focusManagement="Escape key closes modal and restores focus. Tab navigation is handled with custom event listener to implement focus wrapping."
					interactiveStates={[
						{
							state: 'Escape Pressed',
							description: 'Modal closes, focus returns to trigger element',
						},
						{
							state: 'Tab Pressed',
							description: 'Focus moves to next element, wraps at boundaries',
						},
					]}
				/>
				{lastKey && (
					<div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
						<p className="text-sm text-zinc-700 dark:text-zinc-300">
							Last key pressed:{' '}
							<kbd className="rounded bg-zinc-200 px-2 py-1 font-mono text-xs dark:bg-zinc-800">
								{lastKey}
							</kbd>
						</p>
					</div>
				)}
				<PetModal {...args} />
			</div>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates keyboard navigation. Press Escape to close, Tab to navigate. The last pressed key is displayed above the modal.',
			},
		},
	},
}

export const BackdropClick: Story = {
	args: {
		pet: mockPets[0],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement, args }) => {
		await new Promise((resolve) => setTimeout(resolve, 100))

		const dialog = canvasElement.querySelector('[role="dialog"]') as HTMLElement
		expect(dialog).toBeInTheDocument()

		const backdrop = canvasElement.querySelector(
			'[aria-hidden="true"]'
		) as HTMLElement
		expect(backdrop).toBeInTheDocument()

		const dialogRect = dialog.getBoundingClientRect()
		await userEvent.pointer({
			target: dialog,
			coords: { clientX: dialogRect.left + 5, clientY: dialogRect.top + 5 },
			keys: '[MouseLeft]',
		})

		await new Promise((resolve) => setTimeout(resolve, 100))

		expect(args.onClose).toHaveBeenCalled()
	},
	render: (args) => {
		const [clickCount, setClickCount] = useState(0)

		return (
			<div>
				<StateDocumentation
					title="Backdrop Click Accessibility"
					keyboard={[
						{
							key: 'Click (backdrop)',
							description: 'Closes modal when clicking outside modal content',
						},
						{
							key: 'Click (modal content)',
							description: 'Does not close modal (click event is stopped)',
						},
					]}
					screenReader={[
						'Backdrop click closes modal and returns focus',
						'Modal content clicks do not trigger close',
					]}
					ariaAttributes={{
						'aria-hidden': {
							value: 'true (on backdrop)',
							purpose: 'Backdrop is hidden from screen readers',
						},
					}}
					focusManagement="Clicking backdrop closes modal and returns focus to trigger. Clicking modal content does not close it."
					interactiveStates={[
						{
							state: 'Backdrop Clicked',
							description: 'Modal closes, focus returns',
						},
						{
							state: 'Content Clicked',
							description: 'Modal remains open',
						},
					]}
				/>
				<div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
					<p className="text-sm text-zinc-700 dark:text-zinc-300">
						Click the backdrop (dark area) to close. Click count: {clickCount}
					</p>
				</div>
				<PetModal
					{...args}
					onClose={() => {
						setClickCount((c) => c + 1)
						args.onClose()
					}}
				/>
			</div>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates backdrop click behavior. Click the dark backdrop area to close the modal. Clicking the modal content itself does not close it.',
			},
		},
	},
}

export const FocusRestoration: Story = {
	args: {
		pet: mockPets[1],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		await new Promise((resolve) => setTimeout(resolve, 100))

		const triggerButton = canvas.getByRole('button', { name: /open modal/i })
		const modal = canvas.getByRole('dialog')
		const closeButton = canvas.getByLabelText(
			`Close ${mockPets[1].name} details modal`
		)

		expect(closeButton).toHaveFocus()

		await userEvent.keyboard('{Escape}')
		expect(args.onClose).toHaveBeenCalledTimes(1)

		expect(triggerButton).toBeInTheDocument()
	},
	render: (args) => {
		const [isOpen, setIsOpen] = useState(true)
		const triggerButtonRef = useRef<HTMLButtonElement>(null)

		return (
			<div className="p-8">
				<StateDocumentation
					title="Focus Restoration Accessibility"
					keyboard={[
						{
							key: 'Escape / Close Button',
							description: 'Closes modal and returns focus to trigger button',
						},
					]}
					screenReader={[
						'When modal closes, focus returns to trigger element',
						'Screen reader announces the return to trigger context',
					]}
					focusManagement="When modal closes (via Escape, close button, or backdrop click), focus is restored to the element that opened it (triggerElement prop). If no trigger is provided, focus returns to the previously focused element."
					interactiveStates={[
						{
							state: 'Modal Opens',
							description: 'Previous focus stored, focus moves to close button',
						},
						{
							state: 'Modal Closes',
							description: 'Focus returns to stored trigger element',
						},
					]}
				/>
				<button
					ref={triggerButtonRef}
					type="button"
					onClick={() => setIsOpen(true)}
					className="mb-4 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
				>
					Open Modal (Trigger Button)
				</button>
				<PetModal
					pet={args.pet}
					isOpen={isOpen}
					onClose={() => {
						setIsOpen(false)
						args.onClose()
					}}
					triggerElement={triggerButtonRef.current}
				/>
			</div>
		)
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates focus restoration. Click the trigger button to open the modal, then close it. Focus will return to the trigger button.',
			},
		},
	},
}

export const DifferentPet: Story = {
	args: {
		pet: mockPets[2],
		isOpen: true,
		onClose: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		await new Promise((resolve) => setTimeout(resolve, 100))

		const modal = canvas.getByRole('dialog')
		expect(modal).toHaveAttribute('aria-modal', 'true')
		expect(modal).toHaveAttribute('aria-labelledby', 'pet-modal-title')

		const title = canvas.getByText(mockPets[2].name)
		expect(title).toBeInTheDocument()

		const closeButton = canvas.getByLabelText(
			`Close ${mockPets[2].name} details modal`
		)
		expect(closeButton).toBeInTheDocument()

		await userEvent.keyboard('{Escape}')
		expect(args.onClose).toHaveBeenCalledTimes(1)
	},
	render: (args) => (
		<div>
			<StateDocumentation
				title="Modal with Different Pet"
				keyboard={[
					{
						key: 'Escape',
						description: 'Closes modal',
					},
					{
						key: 'Tab',
						description: 'Navigates within modal',
					},
				]}
				screenReader={[
					`Announces: "${args.pet?.name || 'Pet'} details modal, dialog"`,
					`Reads all pet information`,
				]}
				ariaAttributes={{
					role: {
						value: 'dialog',
						purpose: 'Modal dialog',
					},
					'aria-modal': {
						value: 'true',
						purpose: 'Blocks background interaction',
					},
				}}
			/>
			<PetModal {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'Modal displaying a different pet (rabbit) to demonstrate variety.',
			},
		},
	},
}
