One-line: The content surface — warm paper by default, navy for a featured/highlighted card.

```jsx
<Card eyebrow="Service" title="Website design">
  Custom, fast, and built to convert — designed around your customers.
</Card>
<Card variant="feature" title="Managed care" footer={<Button variant="energy">Talk to us</Button>}>
  We keep your site secure, updated, and online.
</Card>
```

Variants: default (paper + soft shadow), feature (navy, inverse text), outline. Slots: `eyebrow`, `title`, `children`, `footer`.