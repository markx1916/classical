import { mount } from '@vue/test-utils';
import App from '../App.vue';
import UserInfoForm from '../components/UserInfoForm.vue';
import PredictionDisplay from '../components/PredictionDisplay.vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the global setTimeout and clearTimeout to control async operations
vi.useFakeTimers();

describe('App.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        // Not stubbing children for a more integrated test of App's core responsibility
        // stubs: {
        //   UserInfoForm: true,
        //   PredictionDisplay: true,
        // }
      }
    });
  });

  afterEach(() => {
    vi.clearAllTimers(); // Clear any pending timers
  });

  it('renders UserInfoForm and PredictionDisplay components', () => {
    expect(wrapper.findComponent(UserInfoForm).exists()).toBe(true);
    expect(wrapper.findComponent(PredictionDisplay).exists()).toBe(true);
  });

  it('initially passes default messages to PredictionDisplay', () => {
    const predictionDisplay = wrapper.findComponent(PredictionDisplay);
    expect(predictionDisplay.props('conclusion')).toContain('Please submit your information');
    expect(predictionDisplay.props('explanation')).toContain('The principles of Taoist divination');
    expect(predictionDisplay.props('timestamp')).toBe('');
  });

  it('updates PredictionDisplay when UserInfoForm emits submit-user-data', async () => {
    const userInfoFormWrapper = wrapper.findComponent(UserInfoForm);
    const predictionDisplayWrapper = wrapper.findComponent(PredictionDisplay);

    // Check initial state of PredictionDisplay (uses default props from App's setup)
    expect(predictionDisplayWrapper.props('conclusion')).toContain('Please submit your information');

    // Simulate form submission data
    const testUserData = {
      name: 'App Test User',
      age: 40,
      birthTime: '1980-01-01T10:00',
      region: 'App Test Region',
      predictionContent: 'Future Test Query',
      photo: null // Or a mock File object if photo logic is deeply tested here
    };

    // Emit event from UserInfoForm component instance
    // This simulates the child component emitting an event that App.vue listens to.
    await userInfoFormWrapper.vm.$emit('submit-user-data', testUserData);

    // Vue Test Utils recommends awaiting nextTick if the component updates its own data
    // or performs DOM updates based on the event.
    // Since handleDivinationRequest is async and involves a setTimeout,
    // we need to manage that.

    // Advance timers to allow the promise in handleDivinationRequest (within setTimeout) to resolve
    vi.advanceTimersByTime(2000); // Advance by more than the 1500ms timeout

    // Wait for Vue to process DOM updates after the promise resolves and state changes
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // Sometimes an extra tick is needed for all reactive updates

    // Assert that PredictionDisplay props were updated
    expect(predictionDisplayWrapper.props('conclusion')).toContain('App Test User');
    expect(predictionDisplayWrapper.props('explanation')).toContain('Future Test Query');
    expect(predictionDisplayWrapper.props('timestamp')).not.toBe(''); // Timestamp should now be set
  });

  it('header and footer are present', () => {
    expect(wrapper.find('header h1').text()).toBe('Taoist Divination Online');
    expect(wrapper.find('footer p').text()).toContain('Taoist Divination Services');
  });
});

// It's crucial to restore real timers after the test file if fake timers were used globally for the file.
// However, `vi.useFakeTimers()` at the top level of a file makes it local to that file.
// If it were truly global, `vi.useRealTimers()` would be at the very end of the file.
// With Vitest, `vi.useFakeTimers()` is scoped to the describe/it block it's in, or the file if top-level.
// `afterEach(() => { vi.clearAllTimers(); })` is good practice.
// If you still want to be absolutely sure:
// afterAll(() => {
//   vi.useRealTimers();
// });
