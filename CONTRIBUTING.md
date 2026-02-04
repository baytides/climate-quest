# Contributing to Climate Quest

Welcome! We're thrilled that you're interested in contributing to Climate Quest. This Oregon Trail-inspired educational game teaches students about California ecosystems, and we'd love your help making it even better.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/climate-quest.git
   cd climate-quest
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Ways to Contribute

### Code

- Fix bugs or implement new features
- Improve accessibility (we aim for WCAG 2.2 AAA)
- Optimize performance
- Add new question formats (true/false, fill-in-blank)
- Write tests

### Content

- Add quiz questions for ecosystems (coastal, wetland, forest, river, mountain, grassland, desert, tundra, coral, urban)
- Write companion dialogue (Coral the Crab, Oliver the Otter, Shelly the Seal, Pete the Pelican)
- Create educational facts for the "Learn Phase"
- Curate educational videos

### Design

- Improve UI/UX
- Create ecosystem illustrations
- Enhance map visuals and animations

### Documentation

- Improve README or this guide
- Write tutorials
- Document code

### Testing

- Report bugs with detailed reproduction steps
- Test on different devices and browsers
- Test with assistive technologies

## Issue Labels

- `good-first-issue` — Great for newcomers, well-scoped tasks
- `help-wanted` — We'd especially appreciate help here
- `bug` — Something isn't working correctly
- `enhancement` — New feature or improvement
- `content` — Adding or improving educational content
- `accessibility` — Accessibility improvements
- `documentation` — Documentation updates

## Pull Request Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Ensure your code follows existing patterns and passes linting:
   ```bash
   npm run lint
   ```
4. Test your changes thoroughly
5. Commit with a clear, descriptive message:
   ```bash
   git commit -m "Add true/false question format"
   ```
6. Push to your fork and open a pull request
7. Fill out the PR template with details about your changes

## Code Style

- We use TypeScript for type safety
- Follow existing code patterns and file organization
- Use meaningful variable and function names
- Keep components focused and reusable
- Add comments for complex logic

## Adding Content

### New Question

Questions are defined in `src/data/locations.ts`. Each question needs:

- Question text
- Four answer options
- Correct answer index
- Difficulty level (easy, medium, hard)
- Standards alignment (NGSS, California EP&C)
- Explanation for feedback

### Companion Dialogue

Companions are defined in `src/data/companions.ts`. Each companion has dialogue for:

- Greetings
- Correct answer reactions
- Incorrect answer reactions
- Healing messages
- Victory and defeat messages

Keep dialogue in character:

- **Coral (Crab)**: Enthusiastic, encouraging
- **Oliver (Otter)**: Playful, curious
- **Shelly (Seal)**: Calm, wise
- **Pete (Pelican)**: Theatrical, storytelling

### Educational Facts

When adding facts for the "Learn Phase":

- Keep them age-appropriate (grades 4-8)
- Focus on California-specific ecosystems when possible
- Include connections to environmental stewardship
- Cite sources for scientific claims

## Accessibility Guidelines

We're committed to making this game accessible to all learners:

- All interactive elements must be keyboard navigable
- Images need descriptive alt text
- Use semantic HTML elements
- Ensure sufficient color contrast (4.5:1 minimum, 7:1 preferred)
- Support reduced motion preferences
- Test with screen readers

## Questions?

- Open a [GitHub Discussion](https://github.com/baytides/climate-quest/discussions) for questions
- Check existing issues before creating new ones
- Reach out to the Bay Tides team at [baytides.org/contact](https://baytides.org/contact)

## Code of Conduct

Be kind, respectful, and constructive. We're building something for kids, and we want our community to reflect the positive values we're teaching.

Thank you for helping make environmental education fun and accessible!
