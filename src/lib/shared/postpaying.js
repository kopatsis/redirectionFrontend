import { getRealToken } from "$lib/stores/firebaseuser";

export async function sendPostRequest() {
  try {
    const token = await getRealToken();

    const url = import.meta.env.VITE_PAY_URL || "https://pay.shortentrack.com";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = "_blank";

    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "idToken";
    tokenInput.value = token;

    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit();

    document.body.removeChild(form);

    return true;
  } catch (error) {
    console.error("Error during POST request:", error);
    return false;
  } 
}
