import * as Client from "@storacha/client";

// Initialize client and login
let client: any = null;
let account: any = null;


async function initStoracha(email: string = process.env.STORACHA_EMAIL!) {
  if (!client) {
    client = await Client.create();
  }

  if (!account) {
    account = await client.login(email);
    await account.plan.wait();
  }

  return { client, account };
}

export const testStorachaConnection = async (email?: string) => {
  try {
    const { account } = await initStoracha(email);

    if (!account) {
      console.error("Account not initialized");
      return { success: false };
    }

    console.log("Storacha connection test successful");
    console.log("Account email:", account.email);
    console.log("Plan info:", account.plan);

    return {
      success: true,
      email: account.email,
      plan: account.plan,
    };
  } catch (err: any) {
    console.error("Storacha connection test failed:", err.message);
    return { success: false, error: err.message };
  }
};


// Upload a single file
export const uploadFile = async (file: File, email?: string) => {
  try {
    const { account } = await initStoracha(email);
    if (!account) throw new Error("Failed to login");

    const uploaded = await account.upload(file);
    return {
      status: "success",
      fileName: file.name,
      url: uploaded.url, // or uploaded.cid depending on Storacha response
    };
  } catch (err: any) {
    console.error("Upload error:", err);
    return {
      status: "error",
      fileName: file.name,
      error: err.message,
    };
  }
};

// Upload multiple files


// Get account info
export const getAccountInfo = async (email?: string) => {
  try {
    const { account } = await initStoracha(email);
    return {
      email: account?.email || null,
      plan: account?.plan || null,
    };
  } catch (err: any) {
    console.error("Get account info error:", err);
    return null;
  }
};
