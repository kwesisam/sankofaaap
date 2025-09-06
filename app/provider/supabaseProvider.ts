import { createClient } from "@supabase/supabase-js";

// Add logging to debug environment variables
console.log(
  "Supabase URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"
);
console.log(
  "Supabase Anon Key:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"
);

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);
    if (error) {
      console.error("Supabase connection test failed:", error);
      return { success: false, error };
    }
    console.log("Supabase connection test successful");
    return { success: true, data };
  } catch (error) {
    console.error("Supabase connection test error:", error);
    return { success: false, error };
  }
};

// Function to sync NextAuth session with Supabase
export const syncAuthWithSupabase = async (nextAuthUser: any) => {
  if (!nextAuthUser?.email) return null;

  try {
    // Try to sign in with the same email (assuming same password or using magic link)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: nextAuthUser.email,
      password: "", // This will fail, but we can handle it
    });

    if (error && error.message.includes("Invalid login credentials")) {
      // User exists but password doesn't match - we need to handle this differently
      console.log(
        "User exists in Supabase but password doesn't match NextAuth"
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error syncing auth:", error);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  console.log("Signing in with email:", email);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("SignIn Response:", data, error);

    if (error) {
      console.error("Error signing in:", error);
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }

    console.log("Signed in successfully:", data);
    return {
      error: null,
      status: "success",
      data: data,
    };
  } catch (error) {
    console.error("Error in signInWithEmail:", error);
    return {
      error: "An unexpected error occurred",
      status: "error",
      data: null,
    };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullname: string,
  type: string
) => {
  console.log("Signing up with email:", email);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://sankofapp.vercel.app/signin",
        data: {
          fullname,
          type,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error);
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }

    console.log("Signed up successfully:", data);
    return {
      error: null,
      status: "success",
      data: data,
    };
  } catch (error) {
    console.error("Error in signUpWithEmail:", error);
    return {
      error: "An unexpected error occurred",
      status: "error",
      data: null,
    };
  }
};

export const signUpWithPhone = async (phone: string, password: string) => {
  console.log("Signing up with phone:", phone);

  try {
    const { data, error } = await supabase.auth.signUp({
      phone,
      password,
      options: {
        channel: "sms",
      },
    });
    console.log("SignUp Response:", data, error);

    if (error) {
      console.error("Error signing up:", error);
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }

    console.log("Signed up successfully:", data);
    return {
      error: null,
      status: "success",
      data: data,
    };
  } catch (error) {
    console.error("Error in signUpWithPhone:", error);
    return {
      error: "An unexpected error occurred",
      status: "error",
      data: null,
    };
  }
};

export const uploadPortfolioImages = async (files: File[]) => {
  try {
    const uploadResults = [];

    for (const file of files) {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const uniqueFileName = `${baseName}_${timestamp}.${fileExt}`;
      const filePath = `portfolioImages/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from("artisans")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.push({
          file: file.name,
          status: "error",
          error: error.message,
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("artisans")
          .getPublicUrl(filePath);

        uploadResults.push({
          file: file.name,
          status: "success",
          publicUrl: publicUrlData.publicUrl,
        });
      }
    }

    return {
      status: "completed",
      results: uploadResults,
    };
  } catch (error) {
    console.error("Unexpected error in uploadPortfolioImages:", error);
    return {
      status: "error",
      error: "Unexpected error",
      results: [],
    };
  }
};

export const uploadProductImages = async (files: File[]) => {
  try {
    const uploadResults = [];

    for (const file of files) {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const uniqueFileName = `${baseName}_${timestamp}.${fileExt}`;
      const filePath = `productImages/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from("artisans")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.push({
          file: file.name,
          status: "error",
          error: error.message,
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("artisans")
          .getPublicUrl(filePath);

        uploadResults.push({
          file: file.name,
          status: "success",
          publicUrl: publicUrlData.publicUrl,
        });
      }
    }

    return {
      status: "completed",
      results: uploadResults,
    };
  } catch (error) {
    console.error("Unexpected error in uploadProductImages:", error);
    return {
      status: "error",
      error: "Unexpected error",
      results: [],
    };
  }
};

export const uploadBusinessProfileImages = async (files: File[]) => {
  try {
    const uploadResults = [];

    for (const file of files) {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const uniqueFileName = `${baseName}_${timestamp}.${fileExt}`;
      const filePath = `businessProfileImages/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from("artisans")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.push({
          file: file.name,
          status: "error",
          error: error.message,
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("artisans")
          .getPublicUrl(filePath);

        uploadResults.push({
          file: file.name,
          status: "success",
          publicUrl: publicUrlData.publicUrl,
        });
      }
    }

    return {
      status: "completed",
      results: uploadResults,
    };
  } catch (error) {
    console.error("Unexpected error in uploadProductImages:", error);
    return {
      status: "error",
      error: "Unexpected error",
      results: [],
    };
  }
};

export const uploadBusinessCoverImage = async (files: File[]) => {
  try {
    const uploadResults = [];

    for (const file of files) {
      const timestamp = Date.now();
      const fileExt = file.name.split(".").pop();
      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const uniqueFileName = `${baseName}_${timestamp}.${fileExt}`;
      const filePath = `businessCoverImage/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from("artisans")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.push({
          file: file.name,
          status: "error",
          error: error.message,
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("artisans")
          .getPublicUrl(filePath);

        uploadResults.push({
          file: file.name,
          status: "success",
          publicUrl: publicUrlData.publicUrl,
        });
      }
    }

    return {
      status: "completed",
      results: uploadResults,
    };
  } catch (error) {
    console.error("Unexpected error in uploadProductImages:", error);
    return {
      status: "error",
      error: "Unexpected error",
      results: [],
    };
  }
};
// Add data to a table
export const addData = async (tableName: string, data: object) => {
  try {
    const { error } = await supabase.from(tableName).insert(data);
    console.log(error);
    if (error) {
      return {
        error: `Failed to insert data in ${tableName}: ${error.message}`,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data: "Data inserted successfully",
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};

// Check if specific data exists in a table
export const dataExistence = async (tableName: string, filter: object) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .match(filter);
    if (error) {
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data: data.length > 0,
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};

// Get all data from a table
export const getAll = async (tableName: string) => {
  try {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data,
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};

// Get specific data using a filter
export const getSpecific = async (tableName: string, filter: object) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .match(filter);
    if (error) {
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data,
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};

// Update data matching a filter
export const updateData = async (
  tableName: string,
  filter: object,
  updates: object
) => {
  console.log(updates, filter);
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .match(filter);
    console.log(data, error);
    if (error) {
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data,
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};

// Delete rows matching a filter
export const deleteSpecific = async (tableName: string, filter: object) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .match(filter);
    if (error) {
      return {
        error: error.message,
        status: "error",
        data: null,
      };
    }
    return {
      error: null,
      status: "success",
      data,
    };
  } catch (err: any) {
    return {
      error: err.message,
      status: "error",
      data: null,
    };
  }
};
