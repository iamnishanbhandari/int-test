import { render, screen } from '@testing-library/react';
import WalletConnect from '@/components/WalletConnect';

describe('WalletConnect Component', () => {
  it('renders status initially', () => {
    render(<WalletConnect />);
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
  });
});