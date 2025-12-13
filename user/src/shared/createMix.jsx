import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/providers/api';
/**
 * A custom hook to handle the logic for creating a new mix.
 */
export const useCreateMix = () => {
  // --- STATE MANAGEMENT ---
  // State for the form inputs, mapping directly to your backend fields
  const [mixType, setMixType] = useState('');     // Corresponds to 'mix_type'
  const [title, setTitle] = useState('');         // Corresponds to 'title'
  const [networkId, setNetworkId] = useState(null); // Corresponds to 'network_id'
  const [pollOptions, setPollOptions] = useState([]); // Corresponds to 'poll_options'

  // State for handling the API request status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // --- DERIVED STATE ---
  // A boolean to determine if the post button should be enabled.
  const isPostEnabled = mixType && title.trim().length > 0;

  // --- LOGIC ---
  /**
   * Handles the submission of the new mix to the backend.
   */
  const handleSubmit = async () => {
    if (!isPostEnabled) {
      console.warn("Submit blocked: A tag and title are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. Construct the payload for the API request.
    const payload = {
      title: title.trim(),
      mix_type: mixType,
    };

    // 2. Add optional fields if they exist.
    if (networkId) {
      payload.network_id = networkId;
    }
    if (mixType === 'polls' && pollOptions.length >= 2) {
      payload.poll_options = pollOptions;
    }

    try {
      // 3. Make the API call using your configured axios instance.
      const response = await api.post('/mixes', payload);

      if (response.status === 201) {
        // On success, navigate the user to the home page.
        navigate('/home');
      }
    } catch (err) {
      // 4. Handle any errors from the API.
      const errorMessage = err.response?.data?.detail || 'An unexpected error occurred.';
      console.error('Failed to create mix:', err);
      setError(errorMessage);
    } finally {
      // 5. Ensure the loading state is turned off.
      setIsLoading(false);
    }
  };

  // --- RETURN VALUE ---
  // Expose all the necessary state variables and functions to the components.
  return {
    mixType,
    setMixType,
    title,
    setTitle,
    networkId,
    setNetworkId,
    pollOptions,
    setPollOptions,
    isLoading,
    error,
    isPostEnabled,
    handleSubmit,
  };
};