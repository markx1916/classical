import { mount } from '@vue/test-utils';
import PredictionDisplay from '../PredictionDisplay.vue';
import { describe, it, expect } from 'vitest';

describe('PredictionDisplay.vue', () => {
  it('renders props correctly', () => {
    const conclusion = 'Test Conclusion Text';
    const explanation = 'Test Explanation Text With\nNewlines.';
    const timestamp = 'Test Timestamp 12:00 PM';
    const wrapper = mount(PredictionDisplay, {
      props: { conclusion, explanation, timestamp },
    });

    expect(wrapper.find('.conclusion-text').text()).toBe(conclusion);
    expect(wrapper.find('.explanation-text').text()).toBe(explanation); // white-space: pre-line should handle newlines in rendering
    expect(wrapper.find('.timestamp').text()).toContain(timestamp);
    expect(wrapper.find('.timestamp').exists()).toBe(true);
  });

  it('renders default messages if props not provided', () => {
    const wrapper = mount(PredictionDisplay);
    // Check against default prop values defined in the component
    expect(wrapper.find('.conclusion-text').text()).toContain('Awaiting your information');
    expect(wrapper.find('.explanation-text').text()).toContain('The principles of divination will be revealed');
    expect(wrapper.find('.timestamp').exists()).toBe(false); // Default timestamp is empty string, so v-if hides it
  });

  it('does not render timestamp if timestamp prop is an empty string', () => {
    const wrapper = mount(PredictionDisplay, {
      props: {
        conclusion: 'Some conclusion',
        explanation: 'Some explanation',
        timestamp: '', // Explicitly empty
      },
    });
    expect(wrapper.find('.timestamp').exists()).toBe(false);
  });

  it('renders timestamp if timestamp prop is provided', () => {
    const wrapper = mount(PredictionDisplay, {
        props: {
            conclusion: 'Some conclusion',
            explanation: 'Some explanation',
            timestamp: 'A real timestamp',
        }
    });
    expect(wrapper.find('.timestamp').exists()).toBe(true);
    expect(wrapper.find('.timestamp').text()).toContain('A real timestamp');
  });
});
