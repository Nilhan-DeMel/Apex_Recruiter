# UI/UX Research

## 2025-2026 Chat + Dashboard Trends

### Design Patterns Applied

| Pattern | Source | Rationale |
|---------|--------|-----------|
| **Liquid Glass** | Apple Vision Pro, Linear | Premium depth feel, modern aesthetic |
| **Bento Grid** | Notion, Linear | Information density, visual hierarchy |
| **Split Panel** | ChatGPT, Claude | Chat + context separation |
| **Streaming UI** | Claude, ChatGPT | Real-time feedback, reduced perceived latency |
| **Quick Chips** | Google Assistant | Reduce typing, guide user |

### Chat UX Best Practices

1. **Message Grouping**: Group consecutive messages by sender
2. **Timestamps**: Show on hover, not cluttering UI
3. **Streaming**: Token-by-token display with cursor
4. **Markdown**: Full support for tables, lists, code
5. **Copy Button**: Per-message, appears on hover
6. **Regenerate**: One-click to re-run AI
7. **Edit & Retry**: Edit last message, re-send

### Color System (Dark Mode Primary)

```css
/* Base */
--background: 222 47% 6%;      /* Deep navy */
--foreground: 210 40% 98%;     /* Off-white */

/* Card / Glass */
--card: 222 47% 10%;           /* Elevated surface */
--card-foreground: 210 40% 98%;

/* Primary */
--primary: 262 83% 58%;        /* Purple accent */
--primary-foreground: 210 40% 98%;

/* Accent */
--accent: 187 92% 69%;         /* Cyan accent */
```

### Typography

```css
/* Headings */
font-family: 'Outfit', sans-serif;
font-weight: 600;

/* Body */
font-family: 'Inter', sans-serif;
font-weight: 400;

/* Code */
font-family: 'JetBrains Mono', monospace;
```

### Animation Principles

- **Micro-interactions**: 150-300ms
- **Page transitions**: 300-500ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Respect prefers-reduced-motion**

## Libraries Selected

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.x | Framework |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | Components |
| Framer Motion | 11.x | Animation |
| react-markdown | 9.x | Markdown rendering |
| Lucide React | latest | Icons |
| pdfkit | latest | PDF export |
| docx | latest | DOCX export |
| mammoth | latest | DOCX parsing |
| pdf-parse | latest | PDF parsing |
| openai | latest | OpenAI SDK |
| firebase | 10.x | Firebase SDK |

## Accessibility Standards

- WCAG 2.2 AA compliance
- Color contrast 4.5:1 minimum
- Keyboard navigation complete
- Screen reader tested
- Focus visible always
- ARIA labels on all interactive elements
