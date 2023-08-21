export function getCookie(name: string): string | null {
  const cookieArray = document.cookie.split('; ');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split('=');
    if (cookie[0] === name) {
      return decodeURIComponent(cookie[1]);
    }
  }
  return null;
}
