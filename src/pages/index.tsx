import { Geist, Geist_Mono } from 'next/font/google'
import { PetGallery } from '../components/PetGallery'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function Home() {
	return (
		<div
			className={`${geistSans.className} ${geistMono.className} min-h-screen bg-zinc-50 font-sans dark:bg-black`}
		>
			<main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<PetGallery />
			</main>
		</div>
	)
}
