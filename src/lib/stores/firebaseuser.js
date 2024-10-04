import { get, writable } from "svelte/store";
import { auth } from "../../auth/firebase";
import {
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { getKey } from "../../routes/getKey";

export const userStore = writable(undefined);

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStore.set(user);
  } else {
    userStore.set(null);
  }
});

export const emailVerifEmail = async () => {
  const user = get(userStore);
  if (user && !user.emailVerified) {
    try {
      await sendEmailVerification(user);
      return true
    } catch (err) {
      return false
    }
  }
  return false
}

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

export const addHasPassword = async () => {
  const user = get(userStore);
  if (user && user.email && user.uid) {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "https://api.shortentrack.com";
    const url = `${backend}/haspassword`;

    try {
      const token = await getRealToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const ret = await response.json();
        console.error(ret);
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.setItem(":HP:" + user.uid, "T");
    }
  }
  return false;
};

export const noEmailSubs = async () => {
  const user = get(userStore);
  if (user && user.email && user.uid) {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "https://api.shortentrack.com";
    const url = `${backend}/emailsubbed`;

    try {
      const token = await getRealToken();

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const ret = await response.json();
        console.error(ret);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const addEmailSubs = async () => {
  const user = get(userStore);
  if (user && user.email && user.uid) {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "https://api.shortentrack.com";
    const url = `${backend}/emailsubbed`;

    try {
      const token = await getRealToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const ret = await response.json();
        console.error(ret);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const getEmailSubs = async () => {
  const user = get(userStore);
  if (user && user.email && user.uid) {
    const backend =
      import.meta.env.VITE_BACKEND_URL || "https://api.shortentrack.com";
    const url = `${backend}/emailsubbed`;

    try {
      const token = await getRealToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const ret = await response.json();
        return true, ret && ret.AllowsEmails ? ret.AllowsEmails : false;
      } else {
        return true, false;
      }
    } catch (err) {
      console.error(err);
      return true, false;
    }
  } else {
    return false, null;
  }
};
