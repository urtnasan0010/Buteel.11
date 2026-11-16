/* eslint-disable @typescript-eslint/no-require-imports -- Isolated real-React browser harness; no live auth or database. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
const { createLoader } = require('./test-loader.cjs');
const browserRequire = process.env.PUBLIC_BROWSER_TOOLS ? createRequire(path.join(process.env.PUBLIC_BROWSER_TOOLS, 'package.json')) : require;
const { chromium } = browserRequire('playwright');
const sources = {};
for (const [id, file] of Object.entries({
  react: 'react/cjs/react.production.js', 'react/jsx-runtime': 'react/cjs/react-jsx-runtime.production.js',
  'react-dom': 'react-dom/cjs/react-dom.production.js', 'react-dom/client': 'react-dom/cjs/react-dom-client.production.js',
  scheduler: 'scheduler/cjs/scheduler.production.js',
})) sources[id] = fs.readFileSync(path.join('node_modules', file), 'utf8');
for (const file of ['post-admin', 'post-article', 'post-draft', 'use-unsaved-changes', 'admin-auth']) {
  const full = `src/client/components/${file}.${file === 'post-draft' || file === 'use-unsaved-changes' ? 'ts' : 'tsx'}`;
  sources[`./${file}`] = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2017 } }).outputText;
}
const posts = createLoader()('src/shared/posts.ts');
const bootstrap = `
const sources = ${JSON.stringify(sources)}, cache = {};
const postsCopy = ${JSON.stringify(posts.postsCopy)};
const mocks = {
  'next/navigation': {useRouter: () => ({refresh() {}, push(url) { history.pushState({}, '', url); render(); }})},
  '@/shared/nationwide': {n: (lang, key) => key},
  '@/shared/posts': {pc: (lang, key) => postsCopy[key][lang], postTypes: ['announcement','event','warning'],
    MAX_IMAGE_BYTES: 5242880, MAX_POST_BYTES: 33554432, MAX_POST_IMAGES: 70,
    todayInMongolia: () => '2026-11-17', postDate: value => value,
    postInputSchema: {safeParse: () => ({success:true})}},
  '@neon/auth/next': {createAuthClient: () => ({emailOtp: {sendVerificationOtp: input => {
    window.sentEmail = input.email; return new Promise(resolve => { window.resolveOtp = () => resolve({}); });
  }}})},
};
function require(id) {
  if (mocks[id]) return mocks[id];
  if (cache[id]) return cache[id].exports;
  if (!sources[id]) throw Error('Unexpected browser dependency: ' + id);
  const module = {exports: {}}; cache[id] = module;
  new Function('require','module','exports', sources[id])(require, module, module.exports);
  return module.exports;
}
const React = require('react');
const root = require('react-dom/client').createRoot(document.getElementById('root'));
const Admin = require('./post-admin').default;
const Login = require('./admin-auth').AdminLogin;
function render() {root.render(location.pathname === '/admin' ? React.createElement(Admin, {lang:'en'}) :
  location.pathname === '/login' ? React.createElement(Login, {lang:'en'}) : React.createElement('p', null, 'Away'));}
addEventListener('popstate', render);
window.renderHarness = render;
render();`;
(async () => {
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route('https://harness.test/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><div id="root"></div>' }));
    await page.route('https://harness.test/api/admin/posts**', route => route.fulfill({ json: {posts:[],page:1,hasMore:false} }));
    await page.goto('https://harness.test/away');
    await page.addScriptTag({ content: bootstrap });
    await page.evaluate(() => { history.pushState({}, '', '/admin'); window.renderHarness(); });
    await page.getByRole('button', {name:'New post', exact:true}).click();
    const title = page.locator('.post-editor textarea').nth(0);
    await title.fill('Recover this unsaved post');
    await page.locator('.post-editor textarea').nth(1).fill('Body retained across browser history.');
    await page.locator('input[type=file]').setInputFiles({name:'sample.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=','base64')});
    const originalImage = await page.locator('.post-image-editor img').getAttribute('src');
    await page.goBack();
    await page.getByText('Away', {exact:true}).waitFor();
    await page.goForward();
    await page.getByText(/Unsaved post restored/).waitFor();
    assert.equal(await page.locator('.post-editor textarea').nth(0).inputValue(), 'Recover this unsaved post');
    assert.equal(await page.locator('.post-editor textarea').nth(1).inputValue(), 'Body retained across browser history.');
    assert.equal(await page.locator('.post-image-editor img').getAttribute('src'), originalImage);
    assert.ok(await page.locator('.post-image-editor img').evaluate(img => img.complete && img.naturalWidth > 0));
    page.once('dialog', dialog => dialog.dismiss());
    await page.getByRole('button', {name:'Cancel',exact:true}).click();
    assert.equal(await page.locator('.post-editor').count(), 1, 'Declining discard retains draft');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', {name:'Cancel',exact:true}).click();
    await page.goBack(); await page.getByText('Away',{exact:true}).waitFor();
    await page.goForward();
    await page.getByRole('button', {name:'New post',exact:true}).waitFor();
    assert.equal(await page.locator('.post-editor').count(), 0, 'Confirmed cancellation clears recovery');
    await page.getByRole('button', {name:'New post',exact:true}).click();
    await page.locator('.post-editor textarea').nth(0).fill('Save clears the recovery copy');
    await page.getByRole('button', {name:'Save draft',exact:true}).click();
    await page.getByText('Saved.', {exact:true}).waitFor();
    await page.goBack(); await page.getByText('Away',{exact:true}).waitFor();
    await page.goForward();
    await page.getByRole('button', {name:'New post',exact:true}).waitFor();
    assert.equal(await page.locator('.post-editor').count(), 0, 'Successful save clears recovery');
    await page.evaluate(() => {history.pushState({}, '', '/login'); window.renderHarness();});
    await page.locator('input[name=email]').fill('first@example.test');
    await page.getByRole('button', {name:'resetPassword',exact:true}).click();
    await page.waitForFunction(() => Boolean(window.resolveOtp));
    await page.locator('input[name=email]').fill('changed@example.test');
    await page.evaluate(() => window.resolveOtp());
    await page.locator('input[name=otp]').waitFor();
    assert.equal(await page.locator('input[name=email]').inputValue(), 'first@example.test');
    assert.equal(await page.evaluate(() => window.sentEmail), 'first@example.test');
    await context.close();
    console.log('Isolated admin checks passed: real React Back/Forward draft and image recovery, cancel/retain/clear, and pending OTP email changes.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
