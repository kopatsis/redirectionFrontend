import { get, writable } from "svelte/store";
import { auth } from "../../auth/firebase";
import { EmailAuthProvider, linkWithCredential, onAuthStateChanged } from "firebase/auth";
import { getKey } from "../../routes/getKey";

export const userStore = writable(undefined);
export const localLogin = writable(false);

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStore.set(user);
  } else {
    userStore.set(null);
  }
});

export const refreshUserData = async () => {
  const user = get(userStore);
  if (user) {
    await user.reload();
    userStore.set(user);
  }
};

export const getToken = async () => {
  const user = get(userStore);
  if (user && user.email && user.emailVerified) {
    const [, token] = await Promise.all([getKey(), user.getIdToken()]);
    return "Bearer " + token;
  } else {
    await getKey();
    return "";
  }
};

export const getRealToken = async () => {
  const user = get(userStore);
  if (user && user.email && user.emailVerified) {
    const token = await user.getIdToken();
    return token;
  }
  throw new Error("no user currently logged in");
};

export const hasPassword = async () => {
  const user = get(userStore);
  if (user && user.email && user.emailVerified) {
    return;
  }
  return false, false;
};

export const hasPassword = async () => {
  const user = get(userStore);
  if (user && user.email && user.emailVerified) {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "https://api.shortentrack.com";
    const url = `${backend}/haspassword`;

    try {
      const token = await getRealToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if ("HasPassword" in data) {
        return data.HasPassword;
      }

      return false;
    } catch {
      return false;
    }
  }
  return false;
};


export async function addPassword(newPassword) {
  try {
    const user = get(userStore)
    if (user && user.email && user.emailVerified) {
      const credential = EmailAuthProvider.credential(user.email, newPassword);

      const uh = await linkWithCredential(user, credential)

      return 'Password added successfully!';
    } else {
      return 'No User';
    }
  } catch (error) {
    return 'Error adding password: ' + error;
  }
}