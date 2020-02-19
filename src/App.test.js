import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('app', () => {
  test('renders learn react link', () => {
    const { queryAllByText } = render(<App />);
    const elements = queryAllByText(/.*$.*/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
