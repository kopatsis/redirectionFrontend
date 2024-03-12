import { writable } from 'svelte/store';

const user = writable({
  userKey: null,
  userName: null,
  userPicture: null,
});

export default user;