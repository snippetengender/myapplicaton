import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

const initialState = {
  formData: {
    name: "",
    description: "",
    logo: null,
    banner: null,
    interest: null,
  },
  nameCheck: {
    status: "idle",
    isAvailable: true,
  },
  creation: {
    status: "idle",
    error: null,
    newNetworkId: null,
  },
  interests: {
    items: [],
    status: "idle",
    error: null,
    currentPage: 1,
    canLoadMore: true,
  },
  currentNetwork: {
    data: null,
    status: "idle",
    error: null,
  },
  editNetwork: {
    initialData: null,
    formData: null,
    updateStatus: "idle",
    error: null,
  },
  ditchStatus: {
    status: "idle",
    error: null,
  },
};

export const fetchInterests = createAsyncThunk(
  "network/fetchInterests",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/entities/interests?page=${page}&limit=20`
      );
      return { ...response.data, page };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkNetworkName = createAsyncThunk(
  "network/checkName",
  async (name, { rejectWithValue }) => {
    if (!name) return { exists: false };
    try {
      const response = await api.get(
        `/networks/check-network-username/?username=${name}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createNetwork = createAsyncThunk(
  "network/create",
  async (_, { getState, rejectWithValue }) => {
    const { formData } = getState().network;
    try {
      const networkDataToSend = {
        name: formData.name,
        description: formData.description,
        interests: {
          name: formData.interest.name,
          reference_id: formData.interest.id,
        },
      };

      const networkResponse = await api.post("/networks/", networkDataToSend);
      const networkId = networkResponse.data.data.id;

      if (!networkId) {
        throw new Error("Network ID not found in response.");
      }

      if (formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append("file", formData.logo);
        logoFormData.append("media_type", "logo");
        logoFormData.append("entity_type", "network");
        logoFormData.append("network_id", networkId);
        await api.post("/media/", logoFormData);
      }

      if (formData.banner) {
        const bannerFormData = new FormData();
        bannerFormData.append("file", formData.banner);
        bannerFormData.append("media_type", "banner");
        bannerFormData.append("entity_type", "network");
        bannerFormData.append("network_id", networkId);
        await api.post("/media/", bannerFormData);
      }

      return { networkId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "An unknown error occurred"
      );
    }
  }
);

export const fetchNetworkById = createAsyncThunk(
  "network/fetchById",
  async (networkId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/networks/${networkId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNetwork = createAsyncThunk(
  "network/update",
  async (
    { networkId, textChanges, newLogoFile, newBannerFile },
    { rejectWithValue }
  ) => {
    try {
      console.log("updateNetwork called with:", {
        networkId,
        textChanges,
        newLogoFile: !!newLogoFile,
        newBannerFile: !!newBannerFile,
      });

      // Upload images first (these will automatically update the network in the backend)
      if (newLogoFile) {
        console.log("Uploading logo file...");
        const logoFormData = new FormData();
        logoFormData.append("file", newLogoFile);
        logoFormData.append("media_type", "logo");
        logoFormData.append("entity_type", "network");
        logoFormData.append("network_id", networkId);
        await api.post("/media/", logoFormData);
        console.log("Logo uploaded successfully");
      }

      if (newBannerFile) {
        console.log("Uploading banner file...");
        const bannerFormData = new FormData();
        bannerFormData.append("file", newBannerFile);
        bannerFormData.append("media_type", "banner");
        bannerFormData.append("entity_type", "network");
        bannerFormData.append("network_id", networkId);
        await api.post("/media/", bannerFormData);
        console.log("Banner uploaded successfully");
      }

      // Update text fields only (name, description, etc.)
      if (Object.keys(textChanges).length > 0) {
        console.log("Updating text fields:", textChanges);
        await api.patch(`/networks/${networkId}`, textChanges);
        console.log("Text fields updated successfully");
      }

      // Fetch fresh data after all updates
      console.log("Fetching updated network data...");
      const finalResponse = await api.get(`/networks/${networkId}`);
      console.log("Updated network data:", finalResponse.data.data);
      return finalResponse.data.data;
    } catch (error) {
      console.error("updateNetwork error:", error);
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
      );
    }
  }
);

export const ditchNetworkById = createAsyncThunk(
  "network/ditchById",
  async (networkId, { rejectWithValue }) => {
    try {
      await api.delete(`/networks/${networkId}`);
      return { networkId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const networkSlice = createSlice({
  name: "network",
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
    clearCurrentNetwork: (state) => {
      state.currentNetwork = initialState.currentNetwork;
    },
    initializeEditForm: (state, action) => {
      state.editNetwork.initialData = action.payload;
      state.editNetwork.formData = action.payload;
      state.editNetwork.updateStatus = "idle";
    },
    setEditFormData: (state, action) => {
      if (state.editNetwork.formData) {
        state.editNetwork.formData = {
          ...state.editNetwork.formData,
          ...action.payload,
        };
      }
    },
    setPendingFileUpload: (state, action) => {
      const { type, file } = action.payload;
      if (!state.editNetwork.pendingFiles) {
        state.editNetwork.pendingFiles = {};
      }
      state.editNetwork.pendingFiles[type] = file;
    },

    clearPendingFiles: (state) => {
      if (state.editNetwork.pendingFiles) {
        state.editNetwork.pendingFiles = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for checkNetworkName
      .addCase(checkNetworkName.pending, (state) => {
        state.nameCheck.status = "loading";
      })
      .addCase(checkNetworkName.fulfilled, (state, action) => {
        state.nameCheck.status = "succeeded";
        state.nameCheck.isAvailable = !action.payload.exists;
      })
      .addCase(checkNetworkName.rejected, (state) => {
        state.nameCheck.status = "failed";
        state.nameCheck.isAvailable = false;
      })

      // Cases for createNetwork
      .addCase(createNetwork.pending, (state) => {
        state.creation.status = "loading";
        state.creation.error = null;
      })
      .addCase(createNetwork.fulfilled, (state, action) => {
        state.creation.status = "succeeded";
        state.creation.newNetworkId = action.payload.networkId;
      })
      .addCase(createNetwork.rejected, (state, action) => {
        state.creation.status = "failed";
        state.creation.error = action.payload;
      })

      // Cases for fetchInterests
      .addCase(fetchInterests.pending, (state) => {
        state.interests.status = "loading";
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.interests.status = "succeeded";
        const { data, pagination, page } = action.payload;
        state.interests.items =
          page === 1 ? data : [...state.interests.items, ...data];
        state.interests.currentPage = pagination.page;
        state.interests.canLoadMore =
          state.interests.items.length < pagination.total;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.interests.status = "failed";
        state.interests.error = action.payload;
      })

      // Cases for fetchNetworkById - CORRECTED
      .addCase(fetchNetworkById.pending, (state) => {
        state.currentNetwork.status = "loading";
        state.currentNetwork.data = null;
      })
      .addCase(fetchNetworkById.fulfilled, (state, action) => {
        state.currentNetwork.status = "succeeded";
        state.currentNetwork.data = action.payload;

        // Only initialize edit form if it's not already initialized
        if (!state.editNetwork.initialData) {
          state.editNetwork.initialData = action.payload;
          state.editNetwork.formData = action.payload;
        }
      })
      .addCase(fetchNetworkById.rejected, (state, action) => {
        state.currentNetwork.status = "failed";
        state.currentNetwork.error = action.payload;
      })

      // Cases for updateNetwork
      .addCase(updateNetwork.pending, (state) => {
        state.editNetwork.updateStatus = "loading";
      })
      .addCase(updateNetwork.fulfilled, (state, action) => {
        state.editNetwork.updateStatus = "succeeded";
        // This updates the state with the fresh data returned by the thunk
        state.currentNetwork.data = action.payload;
        state.editNetwork.initialData = action.payload;
        state.editNetwork.formData = { ...action.payload };
      })
      .addCase(updateNetwork.rejected, (state, action) => {
        state.editNetwork.updateStatus = "failed";
        state.editNetwork.error = action.payload;
      })
      .addCase(ditchNetworkById.pending, (state) => {
        state.ditchStatus.status = "loading";
        state.ditchStatus.error = null;
      })
      .addCase(ditchNetworkById.fulfilled, (state) => {
        state.ditchStatus.status = "succeeded";
        // Reset parts of the state since the network is gone
        state.currentNetwork.data = null;
      })
      .addCase(ditchNetworkById.rejected, (state, action) => {
        state.ditchStatus.status = "failed";
        state.ditchStatus.error = action.payload;
      });
  },
});

export const {
  setFormData,
  setLogoFile,
  setBannerFile,
  resetForm,
  clearCurrentNetwork,
  setEditFormData,
} = networkSlice.actions;

export default networkSlice.reducer;
