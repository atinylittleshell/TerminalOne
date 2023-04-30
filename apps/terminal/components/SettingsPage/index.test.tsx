import { render, waitFor } from '@testing-library/react';

import SettingsPage from './index';

describe('/', () => {
  it('should render without crashing', async () => {
    await waitFor(() => {
      const page = render(<SettingsPage />);
      expect(page).toBeTruthy();
    });
  });
});
