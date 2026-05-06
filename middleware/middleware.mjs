import { next } from '@vercel/edge';

export default function middleware(req) {
  const url = new URL(req.url);

  // Aplica apenas na página principal
  if (url.pathname === '/') {
    const cookieName = 'ab-test-version';
    let version = req.cookies.get(cookieName)?.value;

    // Se o usuário não tem o cookie, sorteia um
    if (!version) {
      version = Math.random() < 0.5 ? 'version-a' : 'version-b';
    }

    // Se for a versão B, faz o "rewrite" (mostra a v2 sem mudar a URL)
    if (version === 'version-b') {
      url.pathname = '/v2.html';
      const response = fetch(url); // Busca o conteúdo da v2
      // Define o cookie para o usuário não mudar de versão depois
      response.then(res => res.headers.set('Set-Cookie', `${cookieName}=${version}; Path=/`));
      return response;
    }
  }

  return next();
}