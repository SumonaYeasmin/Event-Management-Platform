// Base URL for backend authentication APIs
const API_BASE_URL = "http://localhost:5000/api/v1/auth";

/**
 * 1. Service to verify OTP code (Matches your exact backend payload)
 */
export const verifyOtp = async (email: string, code: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        code, 
        type: "ACCOUNT_VERIFY" 
      }),
    });
    
    return await res.json();
  } catch (error) {
    console.error("verifyOtp service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};

/**
 * 2. Service to resend OTP code (Updated to include type: "ACCOUNT_VERIFY")
 */
export const resendOtp = async (email: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email,
        type: "ACCOUNT_VERIFY" // Added to match the resend API specification
      }),
    });

    return await res.json();
  } catch (error) {
    console.error("resendOtp service error:", error);
    throw new Error("Failed to connect to the authentication server.");
  }
};
