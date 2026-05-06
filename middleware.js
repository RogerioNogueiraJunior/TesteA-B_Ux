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
      const newUrl = new URL('/v2.html', req.url);
      const response = next();
      
      // Define o cookie para o usuário não mudar de versão depois
      response.headers.set('Set-Cookie', `${cookieName}=${version}; Path=/; Max-Age=31536000`);
      
      // Reescreve a URL interna
      return new Response(fetch(newUrl.toString()).then(r => r.body), {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return next();
}
