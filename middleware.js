export const config = {
  // Executa o middleware apenas na rota raiz (sua home)
  matcher: '/',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const cookieName = 'ab-test-version';
  
  // 1. Recupera os cookies dos cabeçalhos da requisição nativa
  const cookieHeader = request.headers.get('cookie') || '';
  let version = '';

  if (cookieHeader.includes(cookieName)) {
    const match = cookieHeader.match(new RegExp('(^|; )' + cookieName + '=([^;]*)'));
    version = match ? match[2] : '';
  }

  // 2. Se não houver cookie ativo, sorteia a versão (50/50)
  if (!version) {
    version = Math.random() < 0.5 ? 'version-a' : 'version-b';
  }

  // 3. Define qual arquivo HTML será entregue
  let targetPath = '/index.html';
  if (version === 'version-b') {
    targetPath = '/v2.html';
  }

  // 4. Cria a URL de destino interna para buscar o arquivo correto
  const destinationUrl = new URL(targetPath, request.url);

  // 5. Faz o "Fetch" interno do arquivo HTML correspondente
  // Isso serve o conteúdo sem alterar a URL no navegador do usuário (Rewrite)
  const response = await fetch(destinationUrl);

  // 6. Clona a resposta para podermos injetar o cookie de controle
  const newResponse = new Response(response.body, response);
  newResponse.headers.set(
    'Set-Cookie',
    `${cookieName}=${version}; Path=/; Max-Age=604800; SameSite=Lax`
  );

  return newResponse;
}