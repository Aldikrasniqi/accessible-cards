export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit';
  age: number;
  breed: string;
  description: string;
  imageUrl: string;
  shelterLocation: string;
  adoptionStatus: 'available' | 'pending' | 'adopted';
}

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    type: 'dog',
    age: 3,
    breed: 'Golden Retriever',
    description: 'Friendly and energetic! Loves playing fetch and long walks.',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
    shelterLocation: 'Happy Paws Shelter, Austin TX',
    adoptionStatus: 'available'
  },
  {
    id: '2',
    name: 'Mr. Whiskers',
    type: 'cat',
    age: 5,
    breed: 'Persian',
    description: 'Calm and affectionate. Perfect lap cat for quiet evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    shelterLocation: 'Furry Friends Rescue, Seattle WA',
    adoptionStatus: 'available'
  },
  {
    id: '3',
    name: 'Thumper',
    type: 'rabbit',
    age: 2,
    breed: 'Holland Lop',
    description: 'Gentle and curious. Enjoys hopping around and eating carrots.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400',
    shelterLocation: 'Small Pets Haven, Portland OR',
    adoptionStatus: 'pending'
  }
];
