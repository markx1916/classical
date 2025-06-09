import { mount } from '@vue/test-utils';
import UserInfoForm from '../UserInfoForm.vue';
import { describe, it, expect, vi } from 'vitest';

describe('UserInfoForm.vue', () => {
  it('renders form elements', () => {
    const wrapper = mount(UserInfoForm);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input#name').exists()).toBe(true);
    expect(wrapper.find('input#age').exists()).toBe(true);
    expect(wrapper.find('input#birthTime').exists()).toBe(true);
    expect(wrapper.find('input#region').exists()).toBe(true);
    expect(wrapper.find('textarea#predictionContent').exists()).toBe(true);
    expect(wrapper.find('input#photo').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('updates formData on input', async () => {
    const wrapper = mount(UserInfoForm);
    const nameInput = wrapper.find('input#name');
    await nameInput.setValue('Test Name');
    // Accessing vm.formData for script setup requires exposing it via defineExpose,
    // or testing through emitted events/UI changes.
    // However, for simple direct ref updates in script setup, direct access for testing is often fine if not strictly black-box.
    // Let's assume `formData` is implicitly accessible on `wrapper.vm` for now,
    // or this specific test might need adjustment if `defineExpose` is not used.
    // Vitest/Vue Test Utils might provide access to component instance's refs.
    // If `wrapper.vm.formData` doesn't work, we'd need to expose `formData` in UserInfoForm.vue:
    // `defineExpose({ formData });`
    expect(wrapper.vm.formData.name).toBe('Test Name');
  });

  it('emits submit-user-data with form data on valid submission', async () => {
    const wrapper = mount(UserInfoForm);
    // Set required fields
    await wrapper.find('input#name').setValue('Test User');
    await wrapper.find('input#age').setValue('30');
    await wrapper.find('input#birthTime').setValue('2000-01-01T12:00');
    await wrapper.find('input#region').setValue('Test Region');
    await wrapper.find('textarea#predictionContent').setValue('Test Query');

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted()).toHaveProperty('submit-user-data');
    const emittedEvent = wrapper.emitted('submit-user-data');
    expect(emittedEvent[0][0].name).toBe('Test User');
    expect(emittedEvent[0][0].age).toBe(30);
    // No need to check for photo here as it's not required and not set
  });

  it('does not emit submit-user-data if required fields are missing', async () => {
    const wrapper = mount(UserInfoForm);
    // Mock window.alert as it's called for validation errors
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    await wrapper.find('input#name').setValue(''); // Missing name
    await wrapper.find('input#age').setValue('30');
    await wrapper.find('input#birthTime').setValue('2000-01-01T12:00');
    await wrapper.find('input#region').setValue('Test Region');
    await wrapper.find('textarea#predictionContent').setValue('Test Query');

    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted('submit-user-data')).toBeUndefined();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');

    window.alert.mockRestore(); // Restore original alert
  });

  it('disables submit button and inputs when isLoading is true', async () => {
    const wrapper = mount(UserInfoForm);
    // To test this properly, we need to set isLoading within the component's setup.
    // This can be done if isLoading is exposed, or by triggering an action that sets it.
    // For now, let's simulate the parent component setting it via props if it were a prop,
    // or directly setting it on the vm if exposed (not ideal but works for some test scenarios).
    // The current UserInfoForm manages isLoading internally.
    // So, we trigger the submit to make it true.

    // Fill form to allow submission to proceed and set isLoading = true
    await wrapper.find('input#name').setValue('Test User');
    await wrapper.find('input#age').setValue('30');
    await wrapper.find('input#birthTime').setValue('2000-01-01T12:00');
    await wrapper.find('input#region').setValue('Test Region');
    await wrapper.find('textarea#predictionContent').setValue('Test Query');

    // Mock the component's $emit to control the promise flow
    let emitResolve;
    const unresolvingPromise = new Promise(resolve => { emitResolve = resolve; });
    vi.spyOn(wrapper.vm, '$emit').mockReturnValue(unresolvingPromise);

    // Trigger submission which should set isLoading to true internally
    // No need to await this trigger if we're not waiting for its full completion here,
    // but handleSubmit is async, so triggering and then immediately checking might be a race.
    // However, isLoading is set synchronously at the start of handleSubmit.
    wrapper.find('form').trigger('submit.prevent');

    // Need to wait for Vue to react to isLoading.value = true
    await wrapper.vm.$nextTick();

    // Expect isLoading to be true because the emitted promise hasn't resolved
    // For now, test the direct consequence: button state
    const submitButton = wrapper.find('button[type="submit"]');
    // expect(submitButton.attributes('disabled')).toBeDefined(); // This might be flaky depending on DOM env
    expect(submitButton.element.disabled).toBe(true); // More direct check
    expect(submitButton.text()).toContain('Submitting...');

    // Check a text input
    const nameInput = wrapper.find('input#name');
    // expect(nameInput.attributes('disabled')).toBeDefined();
    expect(nameInput.element.disabled).toBe(true); // More direct check
  });

  it('shows photo preview when a file is selected', async () => {
    const wrapper = mount(UserInfoForm);
    const fileInput = wrapper.find('input#photo');

    // Create a mock file
    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });

    // Mock FileReader
    const mockReader = {
      onload: null,
      readAsDataURL: vi.fn(function() {
        // Simulate the reading process and call onload
        this.onload({ target: { result: 'data:image/png;base64,dummydata' } });
      }),
    };
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader);

    // Simulate file selection
    // Directly setting files on input type=file is not straightforward in JSDOM/HappyDOM.
    // We typically mock the event handler's behavior or parts of it.
    // Here, we'll manually trigger what handlePhotoUpload does after a file is "selected".

    // Simulate the change event object
    const event = { target: { files: [mockFile] } };
    await wrapper.vm.handlePhotoUpload(event); // Call the method directly with the mock event

    await wrapper.vm.$nextTick(); // Wait for DOM updates

    const previewImg = wrapper.find('img.photo-preview');
    expect(previewImg.exists()).toBe(true);
    expect(previewImg.attributes('src')).toBe('data:image/png;base64,dummydata');

    window.FileReader.mockRestore(); // Restore original FileReader
  });
});
