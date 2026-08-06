One-line: The OZMO action button — navy for primary, terracotta for secondary, spark orange reserved for high-energy CTAs.

```jsx
<Button variant="primary">Get a quote</Button>
<Button variant="secondary" size="lg">See our work</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="energy" iconRight={<span>→</span>}>Start today</Button>
```

Variants: `primary` (navy, default), `secondary` (terracotta), `energy` (spark orange — use sparingly, one per view), `ghost` (outlined), `link`. Sizes `sm|md|lg`. Props: `disabled`, `full`, `iconLeft`, `iconRight`, `as="a"`.