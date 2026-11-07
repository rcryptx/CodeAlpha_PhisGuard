import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

describe('PhisGuard routes', () => {
  it('renders the home page at the app root', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('PhisGuard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Think Before You Click.').length).toBeGreaterThan(0);
  });

  it('renders a not found state for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
