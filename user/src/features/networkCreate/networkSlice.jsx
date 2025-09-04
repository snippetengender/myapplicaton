import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../providers/api'; 

const initialState = {
  formData: {
    name: '',
    description: '',
    logo: null,
    banner: null,
    interest: null, 
  },
  nameCheck: {
    status: 'idle', 
    isAvailable: true,
  },
  creation: {
    status: 'idle', 
    error: null,
    newNetworkId: null,
  },
};


export const checkNetworkName = createAsyncThunk(
  'network/checkName',
  async (name, { rejectWithValue }) => {
    if (!name) return { exists: false };
    try {
      const response = await api.get(`/networks/check-network-username/?username=${name}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const createNetwork = createAsyncThunk(
  'network/create',
  async (_, { getState, rejectWithValue }) => {
    const { formData } = getState().network;

    try {
      // ==================================================================
      // STEP 1: Log the data we're about to send to /networks/
      // ==================================================================
      const networkDataToSend = {
        name: formData.name,
        description: formData.description,
        interests: { name: formData.interest, reference_id: formData.interest },
      };
      console.log('✅ STEP 1: Sending to /networks/', networkDataToSend);
      // ==================================================================

      // Make the first API call
      const networkResponse = await api.post('/networks/', networkDataToSend);

      // ==================================================================
      // STEP 2: Log the response we got from /networks/
      // ==================================================================
      console.log('✅ STEP 2: Response from /networks/', networkResponse.data);
      const networkId = networkResponse.data.data.id;
      // ==================================================================

      if (!networkId) {
        throw new Error('Network ID not found in response.');
      }

      // Handle logo upload
      if (formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logo);
        logoFormData.append('media_type', 'logo');
        logoFormData.append('entity_type', 'network');
        logoFormData.append('network_id', networkId);
        
        // ==================================================================
        // STEP 3: Log the data we're about to send to /media/ for the logo
        // ==================================================================
        console.log('✅ STEP 3: Sending to /media/ (Logo)');
        for(const pair of logoFormData.entries()) {
           console.log(`  -> ${pair[0]}:`, pair[1]);
        }
        // ==================================================================
        
        await api.post('/media/', logoFormData);
        console.log('✅ Logo uploaded successfully.');
      }

      // Handle banner upload
      if (formData.banner) {
        const bannerFormData = new FormData();
        bannerFormData.append('file', formData.banner);
        bannerFormData.append('media_type', 'banner');
        bannerFormData.append('entity_type', 'network');
        bannerFormData.append('network_id', networkId);

        // ==================================================================
        // STEP 4: Log the data we're about to send to /media/ for the banner
        // ==================================================================
        console.log('✅ STEP 4: Sending to /media/ (Banner)');
        for(const pair of bannerFormData.entries()) {
           console.log(`  -> ${pair[0]}:`, pair[1]);
        }
        // ==================================================================

        await api.post('/media/', bannerFormData);
        console.log('✅ Banner uploaded successfully.');
      }

      return { networkId };
    } catch (error) {
      console.error('❌ DEBUG: An error occurred in the createNetwork thunk:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.detail || 'An unknown error occurred');
    }
  }
);



// == THE SLICE (No changes needed here) ==
const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setLogoFile: (state, action) => {
      state.formData.logo = action.payload;
    },
    setBannerFile: (state, action) => {
      state.formData.banner = action.payload;
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkNetworkName.pending, (state) => {
        state.nameCheck.status = 'loading';
      })
      .addCase(checkNetworkName.fulfilled, (state, action) => {
        state.nameCheck.status = 'succeeded';
        state.nameCheck.isAvailable = !action.payload.exists;
      })
      .addCase(checkNetworkName.rejected, (state) => {
        state.nameCheck.status = 'failed';
        state.nameCheck.isAvailable = false;
      })
      .addCase(createNetwork.pending, (state) => {
        state.creation.status = 'loading';
        state.creation.error = null;
      })
      .addCase(createNetwork.fulfilled, (state, action) => {
        state.creation.status = 'succeeded';
        state.creation.newNetworkId = action.payload.networkId;
      })
      .addCase(createNetwork.rejected, (state, action) => {
        state.creation.status = 'failed';
        state.creation.error = action.payload;
      });
  },
});

export const { setFormData, setLogoFile, setBannerFile, resetForm } = networkSlice.actions;

export default networkSlice.reducer;