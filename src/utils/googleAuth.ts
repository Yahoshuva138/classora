// Google Identity Services (GIS) & JWT Verification Utility

export interface DecodedGooglePayload {
  iss?: string;
  sub?: string;
  email: string;
  email_verified?: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  hd?: string; // Hosted domain (e.g. sst.scaler.com)
  aud?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
            hosted_domain?: string;
            itp_support?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            }
          ) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
        oauth2?: {
          initTokenClient: (config: any) => any;
          initCodeClient: (config: any) => any;
        };
      };
    };
  }
}

/**
 * Validates whether an email belongs to the official Scaler School of Technology domain
 */
export function isSstEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return /@(sst\.)?scaler\.com$/i.test(clean) || /@sst\.scler\.com$/i.test(clean);
}

/**
 * Decodes Google's Base64-URL encoded JWT Identity Token
 */
export function decodeGoogleJwt(credential: string): DecodedGooglePayload {
  try {
    const parts = credential.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid JWT format');
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err: any) {
    console.error('[GoogleAuth] Failed to decode JWT token:', err);
    throw new Error('Could not parse Google ID token: ' + err.message);
  }
}

/**
 * Gets configured Google Client ID from Vite env or local storage
 */
export function getGoogleClientId(): string {
  const localId = localStorage.getItem('classora_google_client_id');
  if (localId && localId.trim()) return localId.trim();

  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  if (envId && envId.trim()) return envId.trim();

  // Fallback demo client ID format
  return '518296317424-9b2p4qkkm7q7n8rsv0v1k8m5mflvsq01.apps.googleusercontent.com';
}

/**
 * Saves a custom Google Cloud Client ID
 */
export function saveGoogleClientId(clientId: string): void {
  if (clientId.trim()) {
    localStorage.setItem('classora_google_client_id', clientId.trim());
  } else {
    localStorage.removeItem('classora_google_client_id');
  }
}
