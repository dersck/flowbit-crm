## Summary

- Describe the change clearly.
- State the user-facing impact.

## Semantics and Accessibility

- [ ] I verified landmarks and there is only one visible `main` in the affected route tree.
- [ ] I verified there is exactly one visible `h1` on each affected screen.
- [ ] I used semantic collections (`ul/ol/li`, `dl/dt/dd`, `article`, `section`, `aside`) where appropriate.
- [ ] I verified all form fields have programmatic labels and correct `aria-describedby` wiring.
- [ ] I verified icon-only actions use `IconButton` or an explicit accessible name.
- [ ] I verified keyboard interaction for any new dialog, drawer, tabs, or menus.

## Validation

- [ ] `npm run lint`
- [ ] `npm run test:run`
- [ ] `npm run build`
- [ ] `npm run test:e2e` (required when the change affects navigation, dialogs, drawers, tabs, auth, or core workspace screens)

## Security and Configuration

- [ ] No secrets, tokens, or private keys were added to tracked files.
- [ ] I did not commit `.env`, generated reports, or machine-local artifacts.
- [ ] Any new environment variable was documented in `.env.example` and `README.md`.

## Notes

- Risks, follow-ups, or rollout details.
