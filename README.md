## Learning Task: Pet Adoption Form

**Branch:** `feature/pet-adoption-form`

### Objective

Build an accessible `PetAdoptionForm` component to learn Storybook patterns, form accessibility, and state management.

### Requirements

1. **Create the Component** (`src/components/PetAdoptionForm.tsx`)

   - Form fields: name, email, phone, adoption reason (textarea)
   - Submit button
   - Accessible labels and error messages

2. **Create Stories** (`src/stories/PetAdoptionForm.stories.tsx`)

   - `Default` - Empty form state
   - `WithErrors` - Show validation errors
   - `Submitting` - Loading state during submission
   - `Success` - Success state after submission
   - Use `StateDocumentation` to document accessibility

3. **Accessibility Checklist**

   - Proper `aria-label` or `<label>` associations
   - `aria-invalid` and `aria-describedby` for errors
   - Keyboard navigation (Tab, Enter)
   - Screen reader announcements for errors
   - Focus management on submit

4. **Storybook Features to Explore**
   - **Controls** - Make form fields interactive in Storybook
   - **Actions** - Log form submissions
   - **Play functions** - Test form interactions
   - **ArgTypes** - Document props with descriptions

### Getting Started

1. Create the component file
2. Add basic form structure with Tailwind styling
3. Implement validation logic
4. Create stories with different states
5. Add `StateDocumentation` for each story
6. Write `play` functions to test interactions

### Reference

Look at `PetCard.stories.tsx` and `PetModal.stories.tsx` for patterns on:

- Story structure
- StateDocumentation usage
- Play function testing
- Accessibility documentation
