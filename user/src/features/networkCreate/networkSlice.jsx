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
  userNetworks: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  allNetworks: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentPage: 1,
    hasMore: true,
    searchTerm: "",
  },
  // Add separate join/leave status
  joinLeaveStatus: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
};

export const fetchAllNetworks = createAsyncThunk(
  "network/fetchAll",
  async ({ page, searchTerm }, { rejectWithValue }) => {
    try {
      const response = await api.get("/networks/", {
        params: {
          page,
          limit: 10,
          name: searchTerm,
        },
      });
      return { ...response.data, page };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch networks."
      );
    }
  }
);

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

// In your networkSlice.js

// export const fetchNetworkById = createAsyncThunk(
//   "network/fetchById",
//   async ({ networkId, networkMembership, totalMixes }, { rejectWithValue }) => {
//     try {
//       // FIX: Create the request body object directly.
//       const requestBody = {
//         network_membership: networkMembership || false,
//         total_mixes: totalMixes || false,
//       };

//       // Pass the requestBody object directly as the second argument to api.post
//       const response = await api.post(`/networks/${networkId}`, requestBody);

//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchNetworkById = createAsyncThunk(
  "network/fetchById",
  async ({ networkId, networkMembership, totalMixes }, { rejectWithValue }) => {

    try {
      const requestBody = {
        network_membership: networkMembership || false,
        total_mixes: totalMixes || false,
      };
      const response = await api.post(`/networks/${networkId}`, requestBody);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const joinNetwork = createAsyncThunk(
  "network/join",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/networks/${id}/join/`);
      return { networkId: id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data ||
          "Failed to join network"
      );
    }
  }
);

export const leaveNetwork = createAsyncThunk(
  "network/leave",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/networks/${id}/leave/`);
      return { networkId: id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data ||
          "Failed to leave network"
      );
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
      if (newLogoFile) {
        const logoFormData = new FormData();
        logoFormData.append("file", newLogoFile);
        logoFormData.append("media_type", "logo");
        logoFormData.append("entity_type", "network");
        logoFormData.append("network_id", networkId);
        await api.post("/media/", logoFormData);
      }
      if (newBannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append("file", newBannerFile);
        bannerFormData.append("media_type", "banner");
        bannerFormData.append("entity_type", "network");
        bannerFormData.append("network_id", networkId);
        await api.post("/media/", bannerFormData);
      }
      if (Object.keys(textChanges).length > 0) {
        await api.patch(`/networks/${networkId}`, textChanges);
      }
      const fetchParams = {
        network_membership: true,
        total_mixes: true,
      };

      const finalResponse = await api.post(
        `/networks/${networkId}`,
        fetchParams
      );
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

export const fetchUserNetworks = createAsyncThunk(
  "network/fetchUserNetworks",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("No user ID provided.");
    }
    try {
      const response = await api.get(`/networks/user/${userId}`);
      return response.data.data; // The array of networks
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch networks."
      );
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
    setSearchTerm: (state, action) => {
      state.allNetworks.searchTerm = action.payload;
    },
    resetAllNetworks: (state) => {
      state.allNetworks.items = [];
      state.allNetworks.status = "idle";
      state.allNetworks.error = null;
      state.allNetworks.currentPage = 1;
      state.allNetworks.hasMore = true;
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

      // Cases for ditchNetwork
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
      })

      //Cases for Fetching particular user networks
      .addCase(fetchUserNetworks.pending, (state) => {
        state.userNetworks.status = "loading";
        state.userNetworks.error = null;
      })
      .addCase(fetchUserNetworks.fulfilled, (state, action) => {
        state.userNetworks.status = "succeeded";
        state.userNetworks.items = action.payload;
      })
      .addCase(fetchUserNetworks.rejected, (state, action) => {
        state.userNetworks.status = "failed";
        state.userNetworks.error = action.payload;
      })
      .addCase(fetchAllNetworks.pending, (state) => {
        state.allNetworks.status = "loading";
      })
      .addCase(fetchAllNetworks.fulfilled, (state, action) => {
        state.allNetworks.status = "succeeded";
        state.allNetworks.currentPage = action.payload.page;

        if (action.payload.page === 1) {
          // Reset on first page (fresh fetch)
          state.allNetworks.items = action.payload.data;
        } else {
          state.allNetworks.items = [
            ...state.allNetworks.items,
            ...action.payload.data,
          ];
        }

        // Handle "hasMore" properly
        state.allNetworks.hasMore = action.payload.data.length >= 10;
      })

      .addCase(fetchAllNetworks.rejected, (state, action) => {
        state.allNetworks.status = "failed";
        state.allNetworks.error = action.payload;
      })
      .addCase(joinNetwork.pending, (state) => {
        state.joinLeaveStatus.status = "loading";
        state.joinLeaveStatus.error = null;
      })
      .addCase(joinNetwork.fulfilled, (state, action) => {
        state.joinLeaveStatus.status = "succeeded";

        // Get the networkId from the action's meta data
        const networkId = action.meta.arg;

        // Check if the network we just joined is the one we're currently looking at
        if (
          state.currentNetwork.data &&
          state.currentNetwork.data.id === networkId
        ) {
          // 1. Increment the members count
          state.currentNetwork.data.members_count += 1;

          // 2. Create a temporary but valid membership object ourselves
          // This is the key to making the UI update instantly
          state.currentNetwork.data.network_membership = {
            id: "temp-membership-id", // A temporary ID
            role: "member", // The new role
            network_id: networkId,
          };
        }
      })
      .addCase(joinNetwork.rejected, (state, action) => {
        state.joinLeaveStatus.status = "failed";
        state.joinLeaveStatus.error = action.payload;
      })

      // Cases for leaving a network - (This logic is already correct)
      .addCase(leaveNetwork.pending, (state) => {
        state.joinLeaveStatus.status = "loading";
        state.joinLeaveStatus.error = null;
      })
      .addCase(leaveNetwork.fulfilled, (state, action) => {
        state.joinLeaveStatus.status = "succeeded";
        const networkId = action.meta.arg;

        if (
          state.currentNetwork.data &&
          state.currentNetwork.data.id === networkId
        ) {
          state.currentNetwork.data.members_count -= 1;
          state.currentNetwork.data.network_membership = {};
        }
      })
      .addCase(leaveNetwork.rejected, (state, action) => {
        state.joinLeaveStatus.status = "failed";
        state.joinLeaveStatus.error = action.payload;
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
  setSearchTerm,
  resetAllNetworks,
} = networkSlice.actions;

export default networkSlice.reducer;
